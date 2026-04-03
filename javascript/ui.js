

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

export function showContentApp() {
    document.getElementById("loaderApp").classList.add("d-none");
    document.getElementById("appContent").classList.remove("d-none");
}

export function clearListTask() {
    document.getElementById("accordionTask").innerHTML = "";
}

export function hideModal(nameModal) {
    let modalEl;
    if (nameModal === "newsubtask") {
        modalEl = document.getElementById("newSubTaskModal");
    } 
    if (nameModal === "deletetask") {
        modalEl = document.getElementById("confirmDeleteTask");
    }
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();
}

export function openAccordion(accordionId) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(document.getElementById(accordionId));
    bsCollapse.show();
}

export function createListTask(task, onLoadSubTasks, onCompleteTask, isNew = false) {
    const divAccordion = document.getElementById("accordionTask");

    const divAccordionItem = document.createElement("div");
    divAccordionItem.classList.add("accordion-item", "shadow-sm", "mb-2");

    const divAlignItems = document.createElement("div");
    divAlignItems.classList.add("d-flex", "align-items-start");

    const divFlex = document.createElement("div");
    divFlex.classList.add("flex-grow-1");

    const headerAccordion = document.createElement("h2");
    headerAccordion.classList.add("accordion-header");

    const divGroup = document.createElement("div");
    divGroup.classList.add("input-group");
    
    const badge = document.createElement("span");
    const count = 0;
    badge.classList.add("badge", "text-bg-secondary");
    badge.textContent = count;
    if (count === 0) {
        badge.classList.add("text-bg-success");
        badge.classList.remove("text-bg-secondary");
    } else {
        badge.classList.add("text-bg-secondary");
        badge.classList.remove("text-bg-success");
    }

    const inputTask = document.createElement("input");
    inputTask.type = "text";
    inputTask.id = "text-" + task.id;
    inputTask.value = task.name;
    inputTask.classList.add("form-control");
    if (task.completed) inputTask.classList.add("text-decoration-line-through");
                
    const btnCollapse = document.createElement("button");
    const collapseId = "collapse-task-" + task.id;
    btnCollapse.type = "button";
    btnCollapse.classList.add("accordion-button", "btn-small-personalised", "w-auto");
    btnCollapse.setAttribute("data-bs-toggle", "collapse");
    btnCollapse.setAttribute("data-bs-target", "#" + collapseId);

    const divAccordionColapse = document.createElement("div");
    divAccordionColapse.id = collapseId;
    divAccordionColapse.classList.add("accordion-collapse", "collapse");
    divAccordionColapse.setAttribute("data-bs-parent", "#accordionTask");

    const divAccordionBody = document.createElement("div");
    divAccordionBody.id = "accordion-body-" + task.id;
    divAccordionBody.classList.add("accordion-body");
    
    divAccordionColapse.addEventListener("shown.bs.collapse", () => {
        divAccordionBody.innerHTML = "Cargando...";
        onLoadSubTasks(divAccordionBody, task.id);
    });

    divAccordionColapse.addEventListener("hidden.bs.collapse", () => {
        divAccordionBody.innerHTML = "";
    });

    const divContainerBtnNew = document.createElement("div");
    divContainerBtnNew.classList.add("ms-2", "width-40");
    
    const btnNewSubTask = document.createElement("button");
    btnNewSubTask.type = "button";
    btnNewSubTask.classList.add("btn", "btn-primary");
    btnNewSubTask.setAttribute("data-bs-toggle", "modal");
    btnNewSubTask.setAttribute("data-bs-target", "#newSubTaskModal");
    btnNewSubTask.title = "Nueva SubTarea";

    btnNewSubTask.addEventListener("click", () => {
        console.log("NEW SUBTASK");
        const btnSaveNewSubTask = document.getElementById("btnSaveNewSubTask");
        btnSaveNewSubTask.setAttribute("data-id", task.id);
        btnSaveNewSubTask.setAttribute("data-cont-id", divAccordionBody.id);
        btnSaveNewSubTask.setAttribute("data-accordion-id", collapseId);
    });

    const iconNewSubTask = document.createElement("i");
    iconNewSubTask.classList.add("bi", "bi-file-earmark-plus");

    const divContainerBtnComplete = document.createElement("div");
    divContainerBtnComplete.classList.add("ms-2", "width-40");

    const btnCompleteTask = document.createElement("button");
    btnCompleteTask.type = "button";
    btnCompleteTask.classList.add("btn", "btn-success");
    //btnCompleteTask.id = "btnCompleteTask";
    btnCompleteTask.title = "Completado";

    btnCompleteTask.addEventListener("click", async () => {
        const isCompleted = inputTask.classList.contains("text-decoration-line-through");

        const result = await onCompleteTask(task.id, !isCompleted);

        if (result) {
            inputTask.classList.toggle("text-decoration-line-through");
        }
    });

    const iconCompleteTask = document.createElement("i");
    iconCompleteTask.classList.add("bi", "bi-file-earmark-check");

    const divContainerBtnDelete = document.createElement("div");
    divContainerBtnDelete.classList.add("ms-2", "width-40");
    
    const btnDeleteTask = document.createElement("button");
    btnDeleteTask.type = "button";
    btnDeleteTask.classList.add("btn", "btn-danger");
    btnDeleteTask.setAttribute("data-bs-toggle", "modal");
    btnDeleteTask.setAttribute("data-bs-target", "#confirmDeleteTask");
    btnDeleteTask.title = "Eliminar";

    btnDeleteTask.addEventListener("click", () => {
        console.log("DELETE SUBTASK");
        const btnConfirmDeleteTask = document.getElementById("btnConfirmDeleteTask");
        const taskName = document.getElementById("taskNameModalDelete");
        btnConfirmDeleteTask.setAttribute("data-id", task.id);
        btnConfirmDeleteTask.setAttribute("data-cont-id", divAccordionBody.id);
        btnConfirmDeleteTask.setAttribute("data-accordion-id", collapseId);
        taskName.innerText = task.name;
    });

    const iconDeleteTask = document.createElement("i");
    iconDeleteTask.classList.add("bi", "bi-file-earmark-x");
    
    // Agregando a contenedores    
    btnDeleteTask.appendChild(iconDeleteTask);
    divContainerBtnDelete.appendChild(btnDeleteTask);

    btnCompleteTask.appendChild(iconCompleteTask);
    divContainerBtnComplete.appendChild(btnCompleteTask);

    btnNewSubTask.appendChild(iconNewSubTask);
    divContainerBtnNew.appendChild(btnNewSubTask);

    divAccordionColapse.appendChild(divAccordionBody);

    divGroup.appendChild(badge);
    divGroup.appendChild(inputTask);
    divGroup.appendChild(btnCollapse);
    headerAccordion.appendChild(divGroup);

    divFlex.appendChild(headerAccordion);
    divFlex.appendChild(divAccordionColapse);

    divAlignItems.appendChild(divFlex);
    divAlignItems.appendChild(divContainerBtnNew);
    divAlignItems.appendChild(divContainerBtnComplete);
    divAlignItems.appendChild(divContainerBtnDelete);

    divAccordionItem.appendChild(divAlignItems);

    if (isNew) {
        divAccordion.prepend(divAccordionItem);
    } else {
        divAccordion.appendChild(divAccordionItem);
    }
}

export function createListSubTask(container, taskId, subTask, onCompleteSubTask) {
    
    const divInputGroup = document.createElement("div");
    divInputGroup.classList.add("input-group", "mb-2");

    const divContainerCheckbox = document.createElement("div");
    divContainerCheckbox.classList.add("input-group-text");
    
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.checked = subTask.completed;
    
    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.value = subTask.name;
    inputText.classList.add("form-control");
    if (subTask.completed) inputText.classList.add("text-strike");
    
    inputCheckbox.addEventListener("change", async (e) => {
        const result = await onCompleteSubTask(taskId, subTask.id, e.target.checked);
        if (result) {
            inputText.classList.toggle("text-strike");
        }
    });

    const btnDeleteSubTask = document.createElement("button");
    btnDeleteSubTask.type = "button";
    btnDeleteSubTask.classList.add("btn", "btn-danger");
    btnDeleteSubTask.textContent = "Eliminar";

    divContainerCheckbox.appendChild(inputCheckbox);

    divInputGroup.appendChild(divContainerCheckbox);
    divInputGroup.appendChild(inputText);
    divInputGroup.appendChild(btnDeleteSubTask);

    container.appendChild(divInputGroup);
}