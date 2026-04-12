import { BASE_URL } from "./config.js";
import { showErrorAPI, printConsoleError } from "./utils.js";

export async function logout() {
    const refreshToken = localStorage.getItem("refreshTokenTodoList");

    try {
        if (refreshToken) {
            await fetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken })
            });
        }
    } catch (error) {
        const time = new Date(error.timestamp).toLocaleString();
        showErrorAPI(error.error, error.message, time);
        printConsoleError(error);
    } finally {
        localStorage.removeItem("tokenTodoList");
        localStorage.removeItem("refreshTokenTodoList");
        window.location.replace("./index.html");
    }
}