export class SignupForm {
  constructor() {
    this.petAdopterData = {
      adopterFName: 'adopter_first_name',
      adopterLName: 'adopter_last_name',
      adopterEmail: 'adopter_email',
      adopterPhone: 'adopter_phone_number',
      adopterPassword: 'adopter_password',
      livingSituation: 'living_situation'
    };

    this.petAdopterProfile = {
      petExperience: 'pet_experience'
    };

    this.petAdopterConsents = {
      adopterConsents: 'adopter_consents'
    };
  }

  signupButton(data) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = e.target;
      const formData = new FormData(form);

      const adopter = {};
      for (const key in this.petAdopterData) {
        adopter[key] = formData.get(this.petAdopterData[key]);
      }

      const adopterPro = {
        petExperience: formData.getAll(this.petAdopterProfile.petExperience)
      };

      const adopterConsents = {
        consents: formData.getAll(this.petAdopterConsents.adopterConsents)
      };

      const data = {
        adopter,
        adopterPro,
        adopterConsents
      };

      await this.fetchAdopterData(data)
    });
  }

  async fetchAdopterData(data) {
     try{
        const res = await fetch('http://127.0.0.1:5500/frontend/pages/registration.html',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

       const result = await res.json();
       console.log(result);
     }catch(err){
        console.error('connection Error', err.message)
     }
  }
}
