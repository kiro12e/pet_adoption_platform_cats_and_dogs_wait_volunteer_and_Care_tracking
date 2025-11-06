class RegisterStaff{
    constructor(){
        const fieldName = {
            staff_first_name: 'staff_first_name',
            staff_last_name: 'staff_last_name',
            staff_email: 'staff_email',
            staff_password: 'staff_password',
            staff_emergency_number: 'staff_emergency_number',
            agreed_terms: 'agreed_terms',
            consent_background_check: 'consent_background_check',
            wants_updates: 'wants_updates'
        }
    }
    staffSignUp(){
        const staff = document.getElementById('js-staff-signup');
        if(!staff) return;  

        
        let msgEl = document.querySelector('.signupMessage');
        if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.classList.add('signupMessage');
        volunteerForm.appendChild(msgEl);
        }
        this.msgEl = msgEl;

    staff.addEventListener('submit', (e)=>{
         e.preventDefault();
         this.staffSubmit(staff)
    });

    }
    staffSubmit(staff){
        const formData = new FormData(staff);

        const payload = {
            staff_first_name,
            staff_last_name,
            staff_email,
            staff_password,
            staff_emergency_number,
            consents
        }

        Object.keys(payload).forEach(index =>{
            if(payload[index]){
                payload[index] = formData.get(this.fieldName.payload[index]);
            }
            payload[6] === 'consents';
            if(payload[index] ==='consents') payload[index] = formData.get('consents');
        });
    }
    staffValidate(){
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const re = /^(\+639|09)\d{9}$/;

        if(!fieldName.staff_first_name || !fieldName.staff_last_name || !fieldName.staff_email || !fieldName.staff_emergency_number || !fieldName.staff_password){
            this.showMessage('Please fill the requirements', 'danger');
        }
        if(!fieldName.staff_first_name || !fieldName.staff_last_name){
            this.showMessage('Please fill the first name and last name', 'danger');
        }
        if(!email.test(fieldName.staff_email)){
            this.showMessage('invalid format', 'danger');
        }
        if(!re.test(fieldName.staff_emergency_number)){
            this.showMessage('please fill the missing requirements', 'danger')
        }
        if(!fieldName.staff_emergency_number.length === 11){
            this.showMessage('Phone number character must be exact 11 characters', 'danger');
        }
        if(!fieldName.staff_emergency_number < 6){
            this.showMessage('Password must be at least 6 characters', 'danger');
        }
    }
    showMessage(text, type = 'info') {
    if (!this.msgEl) return;
    this.msgEl.innerText = text;
    this.msgEl.className = '';
    this.msgEl.classList.add('alert');
    this.msgEl.classList.add(
      type === 'success' ? 'alert-success' :
      type === 'danger' ? 'alert-danger' :
      'alert-info'
    );
    this.msgEl.setAttribute('role', 'alert');
  }
    
}