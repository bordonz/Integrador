# FOTAZA
# APP DE PUBLICACION DE IMAGENES
Es una aplicacion donde usuarios pueden registrar sus propios gastos y categorizarlos

## FUNCIONALIDADES
Este proyecto es una aplicación web que permite a los usuarios:

- Registrarse y autenticarse.

- Crear publicaciones con título, descripción e imágenes.

- Asociar etiquetas a las publicaciones.

- Valorar y comentar publicaciones de otros usuarios.

- Seguir y dejar de seguir a otros usuarios.

## TECNOLOGÍAS
- Node.js + Express → servidor y rutas.

- Sequelize → ORM para manejar la base de datos.

- Postgres → base de datos relacional.

- Pug → motor de plantillas para las vistas.

- npm → gestión de dependencias.

## ESTRUCTURA DEL PROYECTO
Código:
- /models        → Definición de modelos Sequelize (Usuario, Publicacion, Imagen, Etiqueta, etc.)

- /routes        → Rutas Express (usuario, publicacion, seguir, etc.)

- /controller    → Manejo de la logica de negocio

- /views         → Plantillas Pug

- /seed.js       → Script para poblar datos iniciales

- /app.js        → Configuración principal del servidor

## INSTALACIÓN LOCAL

### Clonar el repositorio
    https://github.com/bordonz/Integrador.git

### Instalar dependencias: 

    npm install

### Configurar variables de entorno en .env:
- Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

        PORT=3000                # Puerto donde corre el servidor

        DB_USER=postgres         # Usuario de la base de datos

        DB_PASSWORD=tu_password  # Contraseña del usuario de la base

        DB_NAME=publicaciones_db # Nombre de la base de datos

        DB_HOST=localhost        # Host de la base de datos

        DB_PORT=5432             # Puerto de la base de datos

        SESSION_KEY=clave_secreta_para_sesiones
    👉 **Notas importantes**:
    - `SESSION_KEY` es tu clave secreta para **express-session**. Debe ser un valor largo y aleatorio (ejemplo: generado con `openssl rand -hex 32`).  
    - Nunca subas tu `.env` al repositorio, añadí `.env` al `.gitignore`.  
  

### Inicializar la base de datos:

    npm run db:init

### Iniciar servidor:

    npm start

### Visitar 
    
    http://localhost:PORT

### SEED INICIAL
El proyecto incluye un seed que crea dos usuarios de prueba:

- Usuario de prueba uno:
    
    - Email: test@test.dev
    
    - Password: test123

- Usuario de prueba dos:

    - Email: harry@example.com
    - Password: haer123

Esto permite autenticacion para crear publicaciones y poder probar las funcionalidades de la aplicación.


### Próximos pasos

- Implementar denuncias

- Agregar chat privado

- Añadir validaciones en formularios.

- Extender el seed para poblar usuarios, publicaciones, imágenes y etiquetas.
