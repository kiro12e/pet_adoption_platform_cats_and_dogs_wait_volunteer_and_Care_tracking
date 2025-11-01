
export class VolunteerRepository{
    constructor(pool){
        this.pool = pool;
    }
    async insertVolunteer(fName, lName, email, phone, password) {
        const [volunteerResult] = await this.pool.execute(
            `INSERT INTO volunteer (first_name, last_name, email, phone, PASSWORD, registration_date) VALUES (?, ?, ?, ?, ?, NOW())`,
            [fName, lName, email, phone, phone || null, password]
        )
        return this.volunteerResult.insertId;
    }
    async insertVolunteerProfile(livingSituation, availability, interested_activity){
        await this.pool.execute(
            `INSERT INTO volunteer_profile(volunteer_id, living_situation, availability, interested_activities) VALUES (?, ?, ?, ?, ?, NOW())`,
            [livingSituation, availability, interested_activity]
        )  
      }
    async insertVolunteerConsents(agreed_term, consent_background_check, wants_update){
     await this.pool.execute(
        `INSERT INTO volunteer_consents(volunteer_id, agreed_terms, wants_updates)`
        [volunteer_id, agreed_term, consent_background_check, wants_update]
     )
    }
    async FindVolunteerByEmail(email){
        if(this,this.pool.execute){
         const [rows] = await this.pool.execute(`SELECT id, PASSWORD, first_name, last_name FROM volunteer WHERE email = ? LIMIT 1`,
            [email]);
        }
        
        const conn = await this.pool.getConnection();
        try {
            const [rows] = await this.pool.execute(`SELECT id, PASSWORD, first_name, last_name FROM volunteer WHERE email = ? LIMIT 1`,
            [email]);
        }catch(err){
            console.err(`CAN'T FIND THIS ACCOUNT`, err.message);
        }finally{
            conn.release();
        }
    }
}

module.exports = {
insertVolunteer, 
insertVolunteerConsents, 
insertAdopterProfile,
FindEmailByID
};

