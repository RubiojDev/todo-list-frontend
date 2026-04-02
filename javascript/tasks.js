import { apiRequest } from "./api.js";
import { initAuth } from "./initAuth.js";
import { showContentApp,
    openAccordion, 
    clearListTask, 
    createListTask,
    createListSubTask,
    hideModalNewSubTask } from "./ui.js";

export async function initTasks() {

    const isAuthenticated = await initAuth();
    if (!isAuthenticated) {
        window.location.replace("./index.html");
        return;
    }

    showContentApp();
    loadTasks();

    async function loadTasks() {
        clearListTask();
        
        try {
            const response = await apiRequest("/tasks", "GET");
            
            for (let i = 0; i < response.content.length; i++) {
                createListTask(response.content[i], loadSubTasks);
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

                createListTask(response, loadSubTasks, true);
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
                    createListSubTask(container, response.content[i]);
                }
            }

        } catch (error) {
            console.error("Error loading subtasks:", error);//MODIFICAR PARA MOSTRAR ERROR EN UI
        }
    }

    const inputSearch = document.getElementById("search");
    let timeout;
    inputSearch.addEventListener("input", () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            let search = inputSearch.value.toLowerCase().trim();

            if (search) {
                try {
                    const response = await apiRequest(
                        `/tasks/name?name=${search}&page=0&size=10`, 
                        "GET"
                    );

                    clearListTask();

                    for (let i = 0; i < response.content.length; i++) {
                        createListTask(response.content[i], loadSubTasks); 
                    }
                } catch(error) {
                    console.error("ERROR");
                }
            } else {
                loadTasks();
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
                hideModalNewSubTask();
    
                if (!container.children.length > 0) {
                    container.innerHTML = "";
                }

                createListSubTask(container, response);

                openAccordion(accordionId);
            } catch (error) {
                console.error(error);
            }
        }
    });

}


