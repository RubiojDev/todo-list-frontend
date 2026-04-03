import { apiRequest } from "./api.js";
import { initAuth } from "./initAuth.js";
import { hideModal,
    openAccordion, 
    clearListTask, 
    showContentApp,
    createListTask,
    createListSubTask } from "./ui.js";

export async function initTasks() {

    const isAuthenticated = await initAuth();
    if (!isAuthenticated) {
        window.location.replace("./index.html");
        return;
    }

    showContentApp();
    loadTasks(0, 10);

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
                createListTask(response.content[i], loadSubTasks, completeTask);
            
            }
            
        } catch (error) {
            console.error("Error loading tasks:", error);//MODIFICAR PARA MOSTRAR ERROR EN UI
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

                createListTask(response, loadSubTasks, completeTask, true);
            } catch (error) {
                console.log("ERROR");
            }
        }
    });

    async function loadSubTasks(container, taskId) {
        try {
            const response = await apiRequest(
                `/tasks/${taskId}/items`, 
                "GET"
            );

            if (response.content.length === 0) {
                container.innerHTML = "Vacio";
            } else {
                container.innerHTML = "";
                for (let i = 0; i < response.content.length; i++) {
                    createListSubTask(container, taskId, response.content[i], completeSubTask);
                }
            }

        } catch (error) {
            console.error("Error loading subtasks:", error);//MODIFICAR PARA MOSTRAR ERROR EN UI
        }
    }

    async function completeTask(taskId, completed) {
        try {
            await apiRequest(
                `/tasks/${taskId}`,
                "PATCH",
                { completed }
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async function completeSubTask(taskId, subtaskId, completed) {
        try {
            await apiRequest(
                `/tasks/${taskId}/items/${subtaskId}`,
                "PATCH",
                { completed }
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const inputSearch = document.getElementById("search");
    let timeout;
    inputSearch.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            let search = inputSearch.value.toLowerCase().trim();

            if (search) {
                loadTasks(0, 10, search);
            } else {
                loadTasks(0, 10);
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

                createListSubTask(container, taskId, response, completeSubTask);

                openAccordion(accordionId);
            } catch (error) {
                console.error(error);
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
                loadTasks(0, 10, search);
            } else {
                loadTasks(0, 10);
            }

        } catch (error) {
            console.error(error);
        }
    });

}