export class SignupForm {
  constructor() {
    // mapping from form field names to API property names
    this.fieldMap = {
      adopterFName: 'adopter_first_name',
      adopterLName: 'adopter_last_name',
      adopterEmail: 'adopter_email',
      adopterPhone: 'adopter_phone_number',
      adopterPassword: 'adopter_password',
      livingSituation: 'living_situation'
    };
  }

  signupButton() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    // feedback element
    let msgEl = document.getElementById('signupMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'signupMessage';
      form.appendChild(msgEl);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const payload = {
        adopterFName: formData.get(this.fieldMap.adopterFName),
        adopterLName: formData.get(this.fieldMap.adopterLName),
        adopterEmail: formData.get(this.fieldMap.adopterEmail),
        adopterPhone: formData.get(this.fieldMap.adopterPhone),
        adopterPassword: formData.get(this.fieldMap.adopterPassword),
        livingSituation: formData.get(this.fieldMap.livingSituation),
        petExperience: formData.getAll('pet_experience'),
        consents: formData.getAll('adopter_consents')
      };

      // Basic client-side validation
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const re = /^(\+639|09)\d{9}$/;

      if (!payload.adopterFName || !payload.adopterLName) {
        showMessage('Please enter your full name.', 'danger');
        return;
      }
      if (!emailRe.test(payload.adopterEmail)) {
        showMessage('Please enter a valid email address.', 'danger');
        return;
      }
      if (!payload.adopterPassword || payload.adopterPassword.length < 6) {
        showMessage('Password must be at least 6 characters.', 'danger');
        return;
      }
     if (!re.test(payload.volunteerPhone) || !payload.adopterPhone.length === 11){
      this.showMessage('Phone number must start with 09 and have exactly 11 digits', 'danger');
      return;
      }

      // send flat load that matches backend expectations
      try {
        const res = await fetch('http://localhost:3000/api/adopters/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (res.ok) {
          showMessage(result.message || 'Registration successful', 'success');
          form.reset();
        } else {
          showMessage(result.message || result.error || 'Registration failed', 'danger');
        }
        console.log('Signup response:', result);
      } catch (err) {
        console.error('Connection error:', err);
        showMessage('Unable to connect to server. Please try again later.', 'danger');
      }
    });

    function showMessage(text, type = 'info') {
      msgEl.innerText = text;
      msgEl.className = '';
      msgEl.classList.add('alert');
      msgEl.classList.add(type === 'success' ? 'alert-success' : type === 'danger' ? 'alert-danger' : 'alert-info');
      msgEl.setAttribute('role', 'alert');
    }
  }
}
