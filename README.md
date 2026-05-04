# Wise Medical Fullstack

Sistema fullstack para la gestión de turnos médicos, agendas profesionales, especialidades, prestaciones, usuarios y pacientes.

El proyecto está desarrollado con un backend en **Node.js, Express y MongoDB**, y un frontend en **Vue 3, Vite, Pinia y Vue Router**. La aplicación simula un sistema de administración médica orientado a la gestión operativa de turnos, profesionales y agendas dentro de un entorno sanitario.

---

## Descripción

**Wise Medical Fullstack** es una aplicación web fullstack orientada a la administración de turnos médicos.

El sistema permite gestionar entidades principales del circuito de atención médica, como usuarios, pacientes, profesionales, especialidades, prestaciones, agendas y turnos. Además, incorpora autenticación, validaciones, documentación Swagger, separación por capas, patrón DAO y pruebas automatizadas.

Desde una mirada de portfolio, este proyecto demuestra conocimientos en desarrollo backend, frontend, arquitectura de aplicaciones web, diseño de APIs REST, validación de datos, autenticación, persistencia en base de datos y construcción de interfaces administrativas.

---

## Funcionalidades principales

### Backend

- API REST con Express.
- Conexión a MongoDB mediante Mongoose.
- Autenticación con JWT.
- Encriptación de contraseñas con bcrypt.
- Validaciones con Joi.
- Middleware de autenticación.
- Middleware de manejo de errores.
- Rate limiting.
- Arquitectura por capas.
- Patrón DAO.
- Documentación Swagger.
- Tests con Mocha, Chai y Supertest.

### Frontend

- Aplicación frontend con Vue 3.
- Proyecto construido con Vite.
- Manejo de estado con Pinia.
- Ruteo con Vue Router.
- Consumo de API con Axios.
- Pantallas de login y registro.
- Layout de dashboard.
- Vistas para gestión de agendas, turnos y perfil.
- Componentes reutilizables.
- Manejo de estados de carga y errores.

---

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi
- Swagger
- Mocha
- Chai
- Supertest

### Frontend

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios
- CSS

---

## Arquitectura general

El proyecto está dividido en dos aplicaciones principales:

```txt
wise-medical-fullstack/
├── backend/
└── frontend/
```

El backend expone una API REST encargada de la lógica de negocio, persistencia, autenticación y validaciones.

El frontend consume la API mediante servicios HTTP y presenta una interfaz visual para que el usuario pueda interactuar con el sistema.

---

## Estructura del proyecto

```txt
wise-medical-fullstack/
├── backend/
│   ├── docs/
│   ├── seed/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   ├── test/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── router/
│   │   ├── services/
│   │   ├── stores/
│   │   └── views/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Módulos principales

- **Usuarios:** registro, login, autenticación y protección de rutas.
- **Pacientes:** administración de datos de pacientes.
- **Profesionales:** gestión de médicos o profesionales de salud.
- **Especialidades:** administración de especialidades médicas.
- **Prestaciones:** definición de servicios o prácticas médicas.
- **Agendas:** configuración de disponibilidad profesional.
- **Turnos:** creación y administración de citas médicas.

---

## Enfoque técnico

El backend sigue una arquitectura por capas:

```txt
Routes → Middlewares → Controllers → Services → DAO / Models → Database
```

Esta separación permite organizar mejor la lógica del sistema, facilitar el mantenimiento y desacoplar la lógica de negocio del acceso a datos.

El frontend está organizado por responsabilidades:

```txt
Components → Layouts → Router → Services → Stores → Views
```

Esto permite mantener una estructura clara, reutilizable y escalable.

---

## Patrón DAO

El backend implementa el patrón DAO para desacoplar la lógica de negocio de la persistencia.

El proyecto contempla diferentes estrategias de almacenamiento, como:

- Memoria.
- File System.
- MongoDB.

Este enfoque mejora la flexibilidad, testabilidad y mantenibilidad del sistema.

---

## Documentación Swagger

El backend incluye documentación Swagger para visualizar y probar los endpoints de la API.

Swagger permite consultar:

- Endpoints disponibles.
- Métodos HTTP.
- Parámetros esperados.
- Cuerpos de request.
- Respuestas posibles.

---

## Instalación y ejecución

El proyecto requiere ejecutar backend y frontend por separado.

### Requisitos previos

- Node.js
- npm
- MongoDB local o en la nube
- Git

---

## Backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la carpeta `backend`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/wise_medical
JWT_SECRET=your_jwt_secret
PERSISTENCE=mongo
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Ejecutar tests:

```bash
npm test
```

---

## Frontend

Ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

---

## Endpoints principales

El backend incluye rutas para recursos como:

```txt
/auth
/users
/pacientes
/profesionales
/especialidades
/prestaciones
/agendas
/turnos
```

Ejemplos:

```txt
POST   /auth/register
POST   /auth/login

GET    /users
POST   /users

GET    /profesionales
POST   /profesionales

GET    /agendas
POST   /agendas

GET    /turnos
POST   /turnos
```

---

## Testing

El backend cuenta con pruebas unitarias e integrales utilizando:

- Mocha
- Chai
- Supertest

Para ejecutar los tests:

```bash
cd backend
npm test
```

---

## Buenas prácticas aplicadas

- Separación frontend/backend.
- Arquitectura backend por capas.
- Patrón DAO.
- Validación de datos.
- Autenticación JWT.
- Manejo centralizado de errores.
- Documentación Swagger.
- Testing automatizado.
- Organización modular del frontend.
- Manejo de estado con Pinia.
- Consumo de API mediante servicios.
- Componentización de la interfaz.

---

## Posibles mejoras futuras

- Roles y permisos.
- Recuperación de contraseña.
- Auditoría de acciones.
- Calendario visual de turnos.
- Cancelación y reprogramación de turnos.
- Notificaciones por email.
- Dashboard con métricas.
- Filtros avanzados.
- Paginación.
- Docker.
- CI/CD.
- Deploy del backend y frontend.

---

## Estado del proyecto

Proyecto funcional en etapa de desarrollo y mejora continua.

El sistema está preparado para ser presentado como parte de un portfolio profesional, demostrando conocimientos en desarrollo fullstack, APIs REST, frontend moderno, arquitectura backend, autenticación, validaciones, persistencia y testing.

---

## Autor

**Darío Villar**  
Analista Programador | Fullstack Developer
