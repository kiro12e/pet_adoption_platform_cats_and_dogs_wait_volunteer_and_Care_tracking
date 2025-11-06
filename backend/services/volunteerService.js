    const bcrypt = require('bcryptjs');
    const { UserDb } = require('../config/user/userDatabase');
    const VolunteerRepository = require('../repositories/volunteerRepository');

    class VolunteerService{
        constructor(load){
            // store the provided input object; keep shape flexible
            this.volSignUp = load || {};
        }

        mapAvailabilityToEnum(availability) {
            const avail = Array.isArray(availability) ? availability : (typeof availability == 'string' ? [availability] : []);

            // List of allowed availability options
            const availAllowed = ['Weekdays', 'Weekend', 'Morning', 'Night'];
            
        // Keep only the values that match the allowed availability options
            return avail.filter(item=> availAllowed.includes(item));
        }   
        mapInterestedToEnum(interested_activities){
            let intAct;

            if(Array.isArray(interested_activities))
                intAct = interested_activities;
            else if(typeof interested_activities === 'string')
                intAct = [interested_activities]
            else
                intAct = [];

            const allowed = ['Dog Care', 'Cat Care', 'Administrative', 'Management'];

            return intAct.filter(item => allowed.includes(item)); 

        }
        async volunteerSignUp(){
            //Get Connection from Database
            const pool = await UserDb();
            const conn = await pool.getConnection(); // The transaction will begin

        try{
            const volunteerId = await this.signUpHandleRegister(conn);
            await this.handleVolunteerProfile(conn, volunteerId);
            await this.handleVolunteerConsents(conn, volunteerId);

            await conn.commit();
            conn.release();


        }catch(err){
            if(conn){
                try {await conn.rollback(); conn.release();} catch(e) { /*ignore*/};
            }
            throw err;
        }
        }
        async signUpHandleRegister(conn){
        const repo = new VolunteerRepository(conn);
        const { volunteerFName, volunteerLName, volunteerEmail, volunteerPhone, volunteerPassword } = this.volSignUp || {};

        // Always use findVolunteerByEmail, which returns a user object or null
        const existing = await repo.findVolunteerByEmail(conn, volunteerEmail);
        if(existing){
                const err = new Error('Email already in use');
                err.status = 409;
                throw err;
            }

        // Hashed password for security 
        const hashedPassword = await bcrypt.hash(volunteerPassword, 10);
        const volunteerId = await repo.insertVolunteer(conn, volunteerFName, volunteerLName, volunteerEmail, volunteerPhone, hashedPassword);
        return volunteerId;
        }
        async handleVolunteerProfile(conn, volunteerId){
            // use mapping helpers (they return arrays of valid values)
            const repo = new VolunteerRepository(conn);
            const mappedAvailability = this.mapAvailabilityToEnum(this.volSignUp.availability);
            const mappedInterestedActivities = this.mapInterestedToEnum(this.volSignUp.interested_activities);

            // ENUM columns expect a single value; pick the first valid match or null
            const availabilityValue = (Array.isArray(mappedAvailability) && mappedAvailability.length) ? mappedAvailability[0] : (mappedAvailability || null);
            const interestedValue = (Array.isArray(mappedInterestedActivities) && mappedInterestedActivities.length) ? mappedInterestedActivities[0] : (mappedInterestedActivities || null);

            await repo.insertVolunteerProfile(conn, volunteerId, availabilityValue, interestedValue);
        }
        async handleVolunteerConsents(conn, volunteer_id){
            const repo = new VolunteerRepository(conn);
            const consentsArray = Array.isArray(this.volSignUp.consents) ? this.volSignUp.consents : (typeof this.volSignUp.consents === 'string' ? [this.volSignUp.consents] : []);

            const agreed_terms = consentsArray.includes('agreed_terms') ? 1 : 0;
            const consent_background_check = consentsArray.includes('consent_background_check') ? 1 : 0;
            const wants_updates = consentsArray.includes('wants_updates') ? 1 : 0;

            await repo.insertVolunteerConsents(conn, volunteer_id, agreed_terms, consent_background_check, wants_updates);
        }
        async VolunteerLogin({volunteerEmail, volunteerPassword}){
            const pool = await UserDb();
            const repo = new VolunteerRepository(pool);
            const user = await repo.findVolunteerByEmail(pool, volunteerEmail);
            if(!user){
            const invalid = new Error('Invalid Credentials.');
            invalid.status = 401;
            throw invalid;
            }
            
            const match = await bcrypt.compare(volunteerPassword, user.password);
            if(!match){
                const e = new Error('Invalid Credentials');
                e.status = 401;
                throw e;
            }
            return {volunteerId: user.id, name: `${user.first_name} ${user.last_name}`}
        }
    }

    module.exports = VolunteerService;