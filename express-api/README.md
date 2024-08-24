# Express SQLite Authentication

Este es un proyecto básico de autenticación utilizando Express y SQLite. El proyecto incluye funcionalidades de registro y login con manejo de sesiones.

## Requisitos

- Node.js (v12 o superior)
- npm (v6 o superior)

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/Andeveling/SENA.git
    cd SENA/express-api
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Crea la base de datos SQLite:

    ```bash
    sqlite3 database/users.db
    ```

4. Crea la tabla `users` en la base de datos:

    ```sql
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
    ```

## Uso

1. Inicia la aplicación:

    ```bash
    npm start
    ```

2. La aplicación estará disponible en `http://localhost:3000`.

### Endpoints

- **`POST /register`**: Registra un nuevo usuario.

    **Request Body**:
    ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña"
    }
    ```

    **Respuestas**:
    - `201 Created`: Usuario registrado exitosamente.
    - `400 Bad Request`: El nombre de usuario o la contraseña no cumplen con los requisitos.
    - `500 Internal Server Error`: Error al registrar el usuario.

- **`POST /login`**: Inicia sesión con un usuario registrado.

    **Request Body**:
    ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña"
    }
    ```

    **Respuestas**:
    - `200 OK`: Inicio de sesión exitoso.
    - `400 Bad Request`: El nombre de usuario o la contraseña no cumplen con los requisitos.
    - `401 Unauthorized`: Nombre de usuario o contraseña incorrectos.
    - `500 Internal Server Error`: Error al iniciar sesión.

## Archivos Importantes

- **`app.js`**: Archivo principal de la aplicación, donde se configuran las rutas y el servidor.
- **`users.db`**: Base de datos SQLite que almacena los usuarios registrados.
- **`.gitignore`**: Archivo que especifica qué archivos y directorios deben ser ignorados por Git.

## Estructura del Proyecto

```plaintext
/
|-- src
    ├── index.js           # Archivo principal de la aplicación
|-- database
    ├── users.db         # Base de datos SQLite
|-- package.json     # Configuración del proyecto y dependencias
|-- package-lock.json # Bloqueo de dependencias para npm
|-- .gitignore       # Archivo de configuración de Git
|-- README.md        # Este archivo

