
export function showError(input, message) {
    const errorDiv = input.nextElementSibling;

    input.classList.remove("is-valid");
    input.classList.add("is-invalid");

    errorDiv.textContent = message;
}

export function clearError(input) {
    const errorDiv = input.nextElementSibling;

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    errorDiv.textContent = "";
}

export function showFormError(message) {
    const formError = document.getElementById("formError");
    formError.scrollIntoView();

    formError.textContent = message;
    formError.classList.remove("d-none");
}

export function cleanFormError() {
    document.getElementById("formError").classList.add("d-none");
    document.getElementById("formError").textContent = "";
}

export function printConsoleError(error) {
    console.error("Date: " + new Date(error.timestamp).toLocaleString()
                    + "\nstatus: " + error.status 
                    + "\nError: " + error.error 
                    + "\nMessage: " + error.message);
    if (error?.fields) {
        Object.entries(error.fields).forEach(([field, message]) => {
            console.error(`- ${field}: ${message}`);
        });
    }
}

export function showModalRegister() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();

    setTimeout(() => {
        modal.hide();
    }, 2500);
}

export function disableInput(input) {
    input.disabled = true;
}

export function enableInput(input) {
    input.disabled = false;
}