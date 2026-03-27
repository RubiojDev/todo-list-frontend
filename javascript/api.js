const BASE_URL = "http://localhost:8080/api"; //CAMBIAR POS VARIABLE DE ENTORNO

export async function apiRequest(endpoint, method = "GET", data = null, requiresAuth = true) {
    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (requiresAuth &&token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

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

    return response.json();
}
