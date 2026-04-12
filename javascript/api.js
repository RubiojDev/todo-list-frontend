import { logout } from "./logout.js";
import { BASE_URL } from "./config.js";

export async function apiRequest(endpoint, method = "GET", data = null, requiresAuth = true) {
    let token = localStorage.getItem("tokenTodoList");
    const refreshToken = localStorage.getItem("refreshTokenTodoList");

    const makeRequest = async (newToken = token) => {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (requiresAuth && newToken) {
            options.headers["Authorization"] = `Bearer ${newToken}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        return fetch(`${BASE_URL}${endpoint}`, options);
    };

    let response = await makeRequest();

    // Si expiró el token
    if (response.status === 401 && refreshToken) {
        try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!refreshResponse.ok) throw new Error("Refresh failed");

            const refreshData = await refreshResponse.json();

            // Guardar nuevos tokens
            localStorage.setItem("tokenTodoList", refreshData.token);
            localStorage.setItem("refreshTokenTodoList", refreshData.refreshToken);

            // Reintentar request original con nuevo token
            response = await makeRequest(refreshData.token);

        }catch (e) {
            logout();
            throw {
                status: 401,
                error: "Unauthorized",
                message: "Sesión expirada"
            };
        }
    }

    if (!response.ok) {
        const errorData = await response.json();

        throw {
            status: response.status,
            error: errorData.error ?? "Unknown error",
            message: errorData.message ?? "An error occurred",
            path: errorData.path ?? "",
            timestamp: errorData.timestamp ?? new Date().toISOString(),
            fields: errorData.fields ?? {},
            raw: errorData // para debug
        };
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return null;
    }

    return response.json();
}
