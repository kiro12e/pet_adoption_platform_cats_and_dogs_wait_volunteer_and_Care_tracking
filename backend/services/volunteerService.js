const bcrypt = require('bcryptjs');
const { UserDb } = require('../config/user/userDatabase');
const repo = require('../repositories/volunteerRepository');
const VolunteerRepository = require('../repositories/volunteerRepository');

class VolunteerService{
    constructor(load){
         this.volSignUp = {
            volunteerFName,
            volunteerLName,
            volunteerEmail,
            volunteerPassword,
            availability = [],
            interested_activities = []
        } = load;
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
        const volunteerId = await this.signUpHandleRegister(conn, volunteerId)


     }catch(err){
        if(conn){
            try {await conn.rollback(); conn.release();} catch(e) { /*ignore*/};
        }
        throw err;
     }
    }
    async signUpHandleRegister(conn, { adopterFName, adopterLName, adopterEmail, adopterPhone, adopterPassword}){
      if(existing && existing.length){ //If the email already exists in the database, registration is not allowed.
            await conn.rollback();
            conn.release();
            const err = new Error('Email already in use');
            err.status = 409;
            throw err;
        }
    
    const insertVolunteer = new VolunteerRepository(insertVolunteer);
    //Hashed password for security 
    const hashedPassword = await bcrypt.hash(volunteerPassword, 10);
    const volunteerId = await repo.insertVolunteer(VolunteerService);
    }
    async handleVolunteerProfile(conn, volunteerId, {availability = [], interested_activities = []}){

    }
}

module.exports = VolunteerRepository;