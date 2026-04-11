
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

export function createListTask(task, onLoadSubTasks, onUpdateTask, isNew = false) {
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

    let timeout;
    let lastNameTask = task.name;
    inputTask.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => { 
            let newNameTask = inputTask.value.trim();

            if (newNameTask) {
                onUpdateTask(task.id, newNameTask, null);
                lastNameTask = newNameTask;
            }
        }, 600);
    });

    inputTask.addEventListener("blur", () => {
        if (inputTask.value.trim() === "") {
            inputTask.value = lastNameTask;
        }
    });
                
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
    divAccordionBody.classList.add("accordion-body", "text-center");
    
    divAccordionColapse.addEventListener("shown.bs.collapse", () => {
        divAccordionBody.innerHTML = "Cargando...";
        onLoadSubTasks(divAccordionBody, task.id);
        
        //createSentinel(divAccordionBody);
///DSFFFFFFFFFFFFFFFFFFFFF
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
        const i = document.getElementById("inputNewSubTask");
        setTimeout(() => {
            i.focus();
        }, 300);
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

        const result = await onUpdateTask(task.id, null, !isCompleted);
console.log("completed");
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

export function createListSubTask(container, taskId, subTask, onUpdateSubTask, onDeleteSubTask, isLoadMore = false) {
    
    const divInputGroup = document.createElement("div");
    divInputGroup.classList.add("input-group", "mb-2");

    const divContainerCheckbox = document.createElement("div");
    divContainerCheckbox.classList.add("input-group-text");
    
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.checked = subTask.completed;
    
    const inputSubTask = document.createElement("input");
    inputSubTask.type = "text";
    inputSubTask.value = subTask.name;
    inputSubTask.classList.add("form-control");
    if (subTask.completed) inputSubTask.classList.add("text-strike");

    let timeout;
    let lastNameSubTask = subTask.name;
    inputSubTask.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => { 
            let newNameTask = inputSubTask.value.trim();

            if (newNameTask) {
                onUpdateSubTask(taskId, subTask.id, newNameTask, null);
                lastNameSubTask = newNameTask;
            }
        }, 600);
    });

    inputSubTask.addEventListener("blur", () => {
        if (inputSubTask.value.trim() === "") {
            inputSubTask.value = lastNameSubTask;
        }
    });
    
    inputCheckbox.addEventListener("change", async (e) => {
        const result = await onUpdateSubTask(taskId, subTask.id, null, e.target.checked);
        if (result) {
            inputSubTask.classList.toggle("text-strike");
        }
    });

    const btnDeleteSubTask = document.createElement("button");
    btnDeleteSubTask.type = "button";
    btnDeleteSubTask.classList.add("btn", "btn-danger");
    btnDeleteSubTask.textContent = "Eliminar";

    btnDeleteSubTask.addEventListener("click", async () => {
        const result = await onDeleteSubTask(taskId, subTask.id);
        if (result) {
            divInputGroup.remove();
        }
    });

    divContainerCheckbox.appendChild(inputCheckbox);

    divInputGroup.appendChild(divContainerCheckbox);
    divInputGroup.appendChild(inputSubTask);
    divInputGroup.appendChild(btnDeleteSubTask);

    if (isLoadMore) {
        const loadMoreBtn = document.getElementById("moreSubTasksBtn-" + taskId);
        container.insertBefore(divInputGroup, loadMoreBtn);
    } else {
        container.appendChild(divInputGroup);
    }
}



export function createSentinel(container, taskId, onLoadMoreSubTasks, ) {
    const moreSubTasksBtn = document.createElement("button");
    moreSubTasksBtn.type = "button";
    moreSubTasksBtn.id = ("moreSubTasksBtn-" + taskId);
    moreSubTasksBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
    moreSubTasksBtn.innerHTML = "Ver mas...";
    container.appendChild(moreSubTasksBtn);
    //return moreSubTasksBtn;

    moreSubTasksBtn.addEventListener("click", () => {
        console.log("SI");
        onLoadMoreSubTasks(container, taskId);
    });

}

export function hideMoreSubTasksBtn(taskId) {
    const moreSubTasksBtn = document.getElementById("moreSubTasksBtn-" + taskId);
    moreSubTasksBtn.remove();
}

function createPreviousBtn(pageActive, onChangePage) {
    const liPrevius = document.createElement("li");
    liPrevius.classList.add("page-item");
    const btnPrevius = document.createElement("button");
    btnPrevius.classList.add("page-link");
    btnPrevius.setAttribute("data-page", "previus");
    btnPrevius.innerHTML = "Previus";

    btnPrevius.addEventListener("click", () => {
        console.log(pageActive - 1);
        onChangePage(pageActive - 1);
    });

    liPrevius.appendChild(btnPrevius);
    return liPrevius;
}

function createNextBtn(pageActive, onChangePage) {
    const liNext = document.createElement("li");
    liNext.classList.add("page-item");

    const btnNext = document.createElement("button");
    btnNext.classList.add("page-link");
    btnNext.setAttribute("data-page", "next");
    btnNext.innerHTML = "Next";

    btnNext.addEventListener("click", () => {
        console.log(pageActive + 1);
        onChangePage(pageActive + 1);
    });

    liNext.appendChild(btnNext);
    return liNext;
}

function createPageBtn(page, isActive = false, onChangePage) {
    const liPage = document.createElement("li");
    liPage.classList.add("page-item");

    const btnPage = document.createElement("button");
    btnPage.classList.add("page-link");
    btnPage.setAttribute("data-page", page);
    btnPage.innerHTML = page;
    liPage.appendChild(btnPage);

    btnPage.addEventListener("click", () => {
        console.log(page - 1);
        onChangePage(page - 1);
    });

    if (isActive) liPage.classList.add("active");

    return liPage;
}

function createSpanDots() {
    const liPage = document.createElement("li");
    liPage.classList.add("page-item");

    const spanDots = document.createElement("span");
    spanDots.classList.add("page-link");
    spanDots.innerHTML = "...";
    liPage.appendChild(spanDots);

    return liPage;
}

function paginationSmall(pageSize, pageActive, onChangePage) {
    let array = [];
    for (let i = 0; i < pageSize; i++) {
        let isActive = false;
        if (pageActive === i) {
            isActive = true;
        }
        array.push(createPageBtn(i + 1, isActive, onChangePage));
    }
    return array;
}

function paginationInitial(pageSize, pageActive, onChangePage) {
    let array = [];
    let isActive = false;
    for (let i = 0; i < 3; i++) {
        if (pageActive === i) {
            isActive = true;
        }
        array.push(createPageBtn(i + 1, isActive, onChangePage));
        isActive = false;
    }
    array.push(createSpanDots());
    array.push(createPageBtn(pageSize, isActive, onChangePage));
    return array;
}

function paginationMiddle(pageSize, pageActive, onChangePage) {
    let array = [];
    let isActive = false;
    array.push(createSpanDots());
    for (let i = 2; i >= 0; i--) {
        if (i === 0) {
            isActive = true;
        }
        array.push(createPageBtn(pageActive - i + 1, isActive, onChangePage))
        isActive = false;
    }
    array.push(createSpanDots());
    array.push(createPageBtn(pageSize, isActive, onChangePage));
    return array;
}

function paginationEnd(pageSize, pageActive, onChangePage) {
    let array = [];
    let isActive = false;
    array.push(createSpanDots());
    for (let i = 3; i >= 0; i--) {
        if (pageSize - i === pageActive + 1) {
            isActive = true;
        }
        array.push(createPageBtn(pageSize - i, isActive, onChangePage))
        isActive = false;
    }
    
    return array;
}




export function createPagination(paginationData, onChangePage) {
    const paginationList = document.getElementById("paginationList");
    paginationList.innerHTML = "";
    const liPrevious = createPreviousBtn(paginationData.page, onChangePage);
    const liNext = createNextBtn(paginationData.page, onChangePage);
    
    if (paginationData.first === true) {
        liPrevious.classList.add("disabled");
    } else {
        liPrevious.classList.remove("disabled");
    }
    
    if (paginationData.last === true) {
        liNext.classList.add("disabled");
    } else {
        liNext.classList.remove("disabled");
    }

    paginationList.appendChild(liPrevious);

    let array = [];
    if (paginationData.totalPages <= 4) {
        array = paginationSmall(paginationData.totalPages, paginationData.page, onChangePage);
        console.log("12A4");
    }

    if (paginationData.totalPages > 4) {

        if (paginationData.page < 3) {
            array = paginationInitial(paginationData.totalPages, paginationData.page, onChangePage);
            console.log("12A...5");
        }

        if (paginationData.page >= 3 && paginationData.page + 1 < paginationData.totalPages -2) {
            array = paginationMiddle(paginationData.totalPages, paginationData.page, onChangePage);
            console.log("..23A..5");
        }

        if (paginationData.page + 1 >= paginationData.totalPages -2) {
            array = paginationEnd(paginationData.totalPages, paginationData.page, onChangePage);
            console.log("... 2 3 4 4");
        }
    }
    
    for (let i = 0; i < array.length; i++) {
        paginationList.appendChild(array[i]);
    }

    paginationList.appendChild(liNext);                        
}

export function showUsername(user) {
    const usernameBtn = document.getElementById("btnUsername");
    usernameBtn.innerText = user.username;
}

export function setupUserEvents(user) {
    const btnEditProfile = document.getElementById("btnEditProfile");
    const inputEmail = document.getElementById("inputEmail");

    btnEditProfile.addEventListener("click", () => {
        inputEmail.value = user.email;
    });
}