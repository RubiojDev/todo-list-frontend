import { apiRequest } from "./api.js";
import { 
    showError, 
    clearError, 
    enableInput,
    disableInput,
    showFormError, 
    cleanFormError, 
    printConsoleError, 
    showModalRegister } from "./ui.js";

export async function initLogin() {
    

    const form = document.getElementById("loginForm");

    const inputEmail = form.loginEmail;
    const messageEmail = "Por favor, ingrese un email válido.";
    
    const inputPassword = form.loginPassword;
    const messagePassword = "La contraseña debe tener al menos 6 caracteres.";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let isValidForm = true;

        const email = inputEmail.value.trim();
        const password = inputPassword.value.trim();

        cleanFormError();

        isValidForm = validateField(inputEmail, !isValidEmail(inputEmail), messageEmail) && isValidForm;
        isValidForm = validateField(inputPassword, password.length < 6, messagePassword) && isValidForm;

        if (isValidForm) {

            disableInput(form.btnLogin);
            try {
                const userData = {
                    email,
                    password
                };
    
                const response = await apiRequest("/auth/login", "POST", userData, false);
    
                localStorage.setItem("tokenTodoList", response.token);
                localStorage.setItem("refreshTokenTodoList", response.refreshToken);
    
                window.location.replace("./tasks.html");

            } catch (error) {
                if (error.status === 401) {
                    showFormError("Email o contraseña incorrectos");
                } else {
                    showFormError(error.message);
                }
                printConsoleError(error);
            } finally {
                enableInput(form.btnLogin);
            }
        }
    });
}

export function initRegister() {
    
    const form = document.getElementById("registerForm");
    
    const inputUsername = form.registerUsername;
    const messageUsername = "El nombre de usuario debe tener al menos 3 caracteres.";

    const inputEmail = form.registerEmail;
    const messageEmail = "Por favor, ingrese un email válido.";
    
    const inputPassword = form.registerPassword;
    const messagePassword = "La contraseña debe tener al menos 6 caracteres.";
    
    const inputConfirmPassword = form.registerConfirmPassword;
    const messageConfirmPassword = "Las contraseñas no coinciden.";
    const messageConfirmPasswordEmpty = "Debe confirmar la contraseña";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        let isValidForm = true;
        
        const username = inputUsername.value.trim();
        const email = inputEmail.value.trim();
        const password = inputPassword.value.trim();
        const confirmPassword = inputConfirmPassword.value.trim();

        cleanFormError();

        isValidForm = validateField(inputUsername, username.length < 3, messageUsername) && isValidForm;
        isValidForm = validateField(inputEmail, !isValidEmail(inputEmail), messageEmail) && isValidForm;
        isValidForm = validateField(inputPassword, password.length < 6, messagePassword) && isValidForm;
        isValidForm = validateConfirmPassword(inputConfirmPassword, password, confirmPassword) && isValidForm;

        if (isValidForm) {
            
            disableInput(form.btnRegister);
            try {
                const userData = {
                    username,
                    email,
                    password
                };
                const response = await apiRequest("/auth/register", "POST", userData, false);

                localStorage.setItem("tokenTodoList", response.token);
                localStorage.setItem("refreshTokenTodoList", response.refreshToken);

                showModalRegister();
                
                setTimeout(() => {
                    window.location.replace("./tasks.html");
                }, 3000);

            } catch (error) {                
                showFormError(error.message);
                printConsoleError(error);
            } finally {
                enableInput(form.btnRegister);
            }
        }
    });

    function validateConfirmPassword(input, password, confirmPassword) {
        if (confirmPassword.length === 0) {
            showError(input, messageConfirmPasswordEmpty);
            return false;
        }

        if (password !== confirmPassword) {
            showError(input, messageConfirmPassword);
            return false;
        }

        clearError(input);
        return true;
    }
}

function isValidEmail(input) {
        return input.checkValidity();
    }

function validateField(input, condition, message) {
        if (condition) {
            showError(input, message);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }