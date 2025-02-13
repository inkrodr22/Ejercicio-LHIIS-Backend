# API de Usuarios y Transacciones

## Descripción
Esta API permite gestionar usuarios y transacciones, incluyendo la creación, actualización y eliminación de registros. Además, permite obtener resúmenes de transacciones y aplicar filtros avanzados.

## Tecnologías Utilizadas
- **Node.js**
- **Express.js**
- **MySQL**
- **Swagger** (Documentación de API)
- **dotenv** (Manejo de variables de entorno)
- **cors** (Manejo de seguridad CORS)
- **Jest & Supertest** (Pruebas unitarias)

## Estructura del Proyecto
```
backend-API/
│── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── swagger.json
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── transaccionController.js
│   ├── models/
│   │   ├── usuarioModel.js
│   │   ├── transaccionModel.js
│   ├── routes/
│   │   ├── usuarioRoutes.js
│   │   ├── transaccionRoutes.js
│── tests/
│   ├── usuarios.test.js
│   ├── transacciones.test.js
│── .env
│── server.js
│── package.json
│── README.md
```

## Instalación y Configuración
### Clonar el repositorio
```sh
git clone https://github.com/inkrodr/LHIIS-API.git
cd LHIIS-API
```

### Instalar dependencias
```sh
npm install
```

### Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y agrega:
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
PORT=
```

### Ejecutar la API
```sh
npm start
```

## Endpoints Disponibles

### Usuarios
| Método  | Endpoint               | Descripción                     |
|---------|------------------------|---------------------------------|
| GET     | `/api/usuarios`        | Obtener todos los usuarios     |
| GET     | `/api/usuarios/{RFC}`  | Obtener un usuario por RFC     |
| POST    | `/api/usuarios`        | Crear un nuevo usuario         |
| PUT     | `/api/usuarios/{RFC}/bloquear` | Bloquear un usuario |
| DELETE  | `/api/usuarios/{id}`   | Eliminar usuario por ID        |

### Transacciones
| Método  | Endpoint                        | Descripción                                     |
|---------|---------------------------------|-------------------------------------------------|
| GET     | `/api/transacciones`           | Obtener todas las transacciones con filtros    |
| POST    | `/api/transacciones`           | Crear una nueva transacción                    |
| PUT     | `/api/transacciones/{id}/status` | Actualizar estado de transacción (solo PENDING) |
| DELETE  | `/api/transacciones/{id}`      | Eliminar una transacción (soft delete)        |
| GET     | `/api/transacciones/resumen/{RFC}` | Obtener resumen de transacciones por usuario |

## Pruebas Unitarias
Ejecutar las pruebas con Jest:
```sh
npm test
```

## Documentación en Swagger
Para acceder a la documentación de la API:
Inicia el servidor (`npm start`)
Visita en tu navegador: `https://ejercicio-lhiis-backend-production.up.railway.app/api-docs/`

## Autores y Contribución
Proyecto desarrollado por Iñaki Rodriguez Morales.
Si deseas contribuir, crea un *pull request* en el repositorio de GitHub.


