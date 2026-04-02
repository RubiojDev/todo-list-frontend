import { apiRequest } from "./api.js";
import { logout } from "./logout.js";

export async function initAuth() {
    const token = localStorage.getItem("tokenTodoList");

    if (!token) return false;

    try {
        await apiRequest("/users/me", "GET"); 
        return true;
    } catch (error) {
        return false;
    }
}