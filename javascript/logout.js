export async function logout() {
    const refreshToken = localStorage.getItem("refreshTokenTodoList");

    try {
        if (refreshToken) {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken })
            });
        }
    } catch (error) {
        console.error("Logout error", error);
    } finally {
        localStorage.removeItem("tokenTodoList");
        localStorage.removeItem("refreshTokenTodoList");
        window.location.replace("./index.html");
    }
}