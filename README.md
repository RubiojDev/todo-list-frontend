# Todo List App (Frontend)

Aplicación web que consume la Todo List API para gestionar tareas y subtareas con autenticación JWT.

Permite a los usuarios registrarse, iniciar sesión y administrar sus tareas de forma segura.

## ✨ Características

- Registro y login de usuarios
- Autenticación con JWT + Refresh Token
- Persistencia de sesión en el navegador
- Creación, edición y eliminación de tareas
- Gestión de subtareas
- Manejo automático de expiración de token
- Redirecciones según estado de autenticación

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- Fetch API
- LocalStorage (manejo de tokens)
- Bootstrap

## 🔐 Autenticación

El frontend implementa un sistema de autenticación basado en JWT:

- El access token se guarda en `localStorage`
- El refresh token permite renovar la sesión automáticamente
- Si el token expira:
  - Se intenta refrescar automáticamente
  - Si falla, se hace logout

### Flujo:

1. Login → se guardan `token` y `refreshToken`
2. Cada request usa `Authorization: Bearer <token>`
3. Si hay error 401:
   - Se intenta `/auth/refresh`
   - Se reintenta la request original
4. Si falla → logout automático

## 🔄 Control de acceso

La aplicación controla el acceso a las páginas según el estado de autenticación del usuario.

La verificación se realiza mediante `initAuth.js`, que valida la sesión consultando un endpoint protegido (`/users/me`).  
Esto permite confirmar si el token es válido o renovarlo automáticamente en caso de expiración.

- Si el usuario está autenticado:
  - No puede acceder a `login` o `register`
  - Es redirigido a `tasks`

- Si el usuario NO está autenticado:
  - No puede acceder a `tasks`
  - Es redirigido a `index` (login)

Este enfoque evita depender únicamente de la existencia de un token en el cliente y asegura que la sesión sea válida en el backend.

## 📁 Estructura

```bash
/js
 ├── api.js        # Manejo de requests + refresh automático
 ├── auth.js       # Manejo de lógica de registro y login
 ├── config.js     # Variables de utilidad compartida
 ├── initAuth.js   # Verificación inicial de autenticación
 ├── logout.js     # Cierre de sesión
 ├── main.js       # Inicializador de los JavaScript Principales
 ├── tasks.js      # Manejo de logica de la App principal
 └── ui.js         # Manejo de la interface grafica

/css
└── style.css      # Estilos personalizados

/pages
 ├── index.html    # Login
 ├── register.html # Registro
 └── tasks.html    # App principal
 ```

 ## ⚙️ Ejecución

1. Clonar el repositorio

```bash
git clone https://github.com/RubiojDev/todo-list-frontend.git
```

2. Abrir el proyecto
    
    Puedes abrir directamente el archivo:

```bash
index.html
```

3. Asegúrate de que el backend esté corriendo en:

```bash
http://localhost:8080/api
```


## 🔗 Conexión con el backend

Este frontend consume la API:

👉 https://github.com/RubiojDev/todo-list-api

## 📸 Capturas

![login](/resources/login.webp)

![register](/resources/register.webp)

![Tasks](/resources/tasks.webp)

