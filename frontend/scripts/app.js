import { toggleButton } from "./utils/toggleRegistration.js";
import { ToggleLogin } from './utils/toggleLoginForm.js';
import { SignupForm } from "./pages/registerAdopter.js";


toggleButton(); 
const LoginToggler = new ToggleLogin();
LoginToggler.ToggleLoginButton()

const SignUp = new SignupForm();
SignUp.signupButton()

