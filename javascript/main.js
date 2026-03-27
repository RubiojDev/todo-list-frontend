import { initLogin, initRegister } from "./auth.js";
//import { initTasks } from "./tasks.js";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "login") initLogin();

    if (page === "register") initRegister();
    
    //if (page === "tasks") initTasks();

});