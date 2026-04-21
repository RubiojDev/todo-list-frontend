import { apiRequest } from "./api.js";
import { logout } from "./logout.js";
import { initAuth } from "./initAuth.js";
import { paginationState, paginationItemsState } from "./config.js";
import { hideModal,
    showErrorAPI,
    showUsername,
    openAccordion, 
    clearListTask, 
    showContentApp,
    createListTask,
    createSentinel,
    setupUserEvents,
    createPagination,
    createListSubTask,
    printConsoleError,
    addSubTaskToCount,
    hideMoreSubTasksBtn } from "./ui.js";

export async function initTasks() {

    const isAuthenticated = await initAuth();
    if (!isAuthenticated) {
        window.location.replace("./index.html");
        return;
    }

    showContentApp();
    initUser();
    loadTasks(paginationState.page, paginationState.size);

    async function initUser() {
        try {
            const response = await apiRequest(`/users/me`,
                "GET"
            );

            showUsername(response);
            setupUserEvents(response);

            return response;
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            throw error;
        }
    }
    
    async function loadTasks(page, size, search) {
        try {
            let response;

            if (search) {
                response = await apiRequest(
                    `/tasks/name?name=${search}&page=${page}&size=${size}`, 
                    "GET"
                );
            } else {
                response = await apiRequest(
                    `/tasks?page=${page}&size=${size}`, 
                    "GET"
                );
            }

            clearListTask();
            
            for (let i = 0; i < response.content.length; i++) {
                createListTask(response.content[i], loadSubTasks, updateTask);
            }
            
            createPagination(response, changePage);
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
        }
    }
    
    const btnNewTask = document.getElementById("btnNewTask");
    btnNewTask.addEventListener("click", async () => {
        const inputNewTask = document.getElementById("inputNewTask");
        const newTask = inputNewTask.value.trim();

        if (newTask) {
            try {
                const response = await apiRequest(
                    "/tasks", 
                    "POST", 
                    { name: newTask }
                );

                createListTask(response, loadSubTasks, updateTask, true);
                inputNewTask.value = "";
            } catch (error) {
                const time = new Date(error.timestamp).toLocaleString();
                showErrorAPI(error.error, error.message, time);
                printConsoleError(error);
            }
        }
    });

    async function loadSubTasks(container, taskId) {
        try {
            paginationItemsState.page = 0;
            paginationItemsState.size = 5;
            const response = await apiRequest(
                `/tasks/${taskId}/items?page=${paginationItemsState.page}&size=${paginationItemsState.size}`, 
                "GET"
            );

            if (response.content.length === 0) {
                container.innerHTML = "Vacio";
            } else {
                container.innerHTML = "";

                for (let i = 0; i < response.content.length; i++) {
                    createListSubTask(container, taskId, response.content[i], updateSubTask, deleteSubTask);
                }

                if (!response.last) {
                    createSentinel(container, taskId, loadMoreSubTasks);
                }
            }

        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
        }
    }

    async function loadMoreSubTasks(container, taskId) {
        try {
            paginationItemsState.page += 1;

            const response = await apiRequest(
                `/tasks/${taskId}/items?page=${paginationItemsState.page}&size=${paginationItemsState.size}`, 
                "GET"
            );

            for (let i = 0; i < response.content.length; i++) {
                createListSubTask(container, taskId, response.content[i], updateSubTask, deleteSubTask, true);
            }

            if (response.last) {
                hideMoreSubTasksBtn(taskId);
            }
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
        }
    }

    async function updateTask(taskId, name, completed) {
        let update;

        if (name !== null) update = { name: name };

        if (completed !== null) update = { completed: completed};

        try {
            await apiRequest(
                `/tasks/${taskId}`,
                "PATCH",
                update
            );

            return true;
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
            return false;
        }
    }

    async function updateSubTask(taskId, subTaskId, name, completed) {
        let update;

        if (name !== null) update = { name: name };

        if (completed !== null) update = { completed: completed};

        try {
            await apiRequest(
                `/tasks/${taskId}/items/${subTaskId}`,
                "PATCH",
                update
            );

            return true;
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
            return false;
        }
    }

    async function deleteSubTask(taskId, subTaskId) {
        try {
            apiRequest(
                `/tasks/${taskId}/items/${subTaskId}`,
                "DELETE"
            )
            return true;
        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
            return false;
        }
    }

    let timeout;
    const inputSearch = document.getElementById("search");
    inputSearch.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            let search = inputSearch.value.toLowerCase().trim();

            if (search) {
                loadTasks(paginationState.page, paginationState.size, search);
            } else {
                loadTasks(paginationState.page, paginationState.size);
            }
        }, 400);
    });

    const btnSaveNewSubTask = document.getElementById("btnSaveNewSubTask");
    btnSaveNewSubTask.addEventListener("click", async() => {

        const taskId = btnSaveNewSubTask.dataset.id;
        const containerId = btnSaveNewSubTask.dataset.contId;
        const accordionId = btnSaveNewSubTask.dataset.accordionId;
        const container = document.getElementById(containerId);
        const inputNewSubTask = document.getElementById("inputNewSubTask");
        const name = inputNewSubTask.value.trim();

        if (name) {
            try {
                const response = await apiRequest(
                    `/tasks/${taskId}/items`, 
                    "POST", 
                    { name }
                );
                
                inputNewSubTask.value = "";
                hideModal("newsubtask");
    
                if (!container.children.length > 0) {
                    container.innerHTML = "";
                }

                createListSubTask(container, taskId, response, updateSubTask, deleteSubTask);

                openAccordion(accordionId);
                addSubTaskToCount(taskId);
            } catch (error) {
                const time = new Date(error.timestamp).toLocaleString();
                showErrorAPI(error.error, error.message, time);
                printConsoleError(error);
            }
        }
    });

    const btnConfirmDeleteTask = document.getElementById("btnConfirmDeleteTask");
    btnConfirmDeleteTask.addEventListener("click", async() => {

        const taskId = btnConfirmDeleteTask.dataset.id;
        
        try {
            await apiRequest(
                `/tasks/${taskId}`, 
                "DELETE"
            );
            hideModal("deletetask");
            let search = inputSearch.value.toLowerCase().trim();

            if (search) {
                loadTasks(paginationState.page, paginationState.size, search);
            } else {
                loadTasks(paginationState.page, paginationState.size);
            }

        } catch (error) {
            const time = new Date(error.timestamp).toLocaleString();
            showErrorAPI(error.error, error.message, time);
            printConsoleError(error);
        }
    });

    function changePage(page) {
        paginationState.page = page;
        let search = inputSearch.value.toLowerCase().trim();

        if (search) {
            loadTasks(paginationState.page, paginationState.size, search);
        } else {
            loadTasks(paginationState.page, paginationState.size);
        }
    }

    const btnConfirmDeleteAccount = document.getElementById("btnConfirmDeleteAccount");
    btnConfirmDeleteAccount.addEventListener("click", async () => {
        const inputConfirmDeleteAccount = document.getElementById("inputConfirmDeleteAccount");
        const confirmDelete = inputConfirmDeleteAccount.value.trim().toLowerCase();

        if (confirmDelete === "eliminar") {
            try {
                await apiRequest(
                    `/users/me`, 
                    "DELETE"
                );

                localStorage.removeItem("tokenTodoList");
                localStorage.removeItem("refreshTokenTodoList");
                window.location.replace("./index.html");
            } catch (error) {
                const time = new Date(error.timestamp).toLocaleString();
                showErrorAPI(error.error, error.message, time);
                printConsoleError(error);
            }
        }
    });

    const btnLogout = document.getElementById("btnLogout");
    btnLogout.addEventListener("click", () => {
        logout();
    });

}