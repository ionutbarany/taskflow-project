# TaskFlow — API REST (Node.js + Express)

Este directorio contiene el **servidor HTTP** del proyecto TaskFlow: una API REST que persiste tareas en memoria (proceso Node) y expone operaciones para que el frontend las consuma mediante JSON.

La implementación sigue un patrón clásico de **capas**: punto de entrada (`index.js`), enrutamiento, controladores (adaptación HTTP ↔ dominio), servicio (lógica y almacenamiento en memoria) y configuración (`config/env.js`).

---

## Tabla de contenidos

1. [Requisitos y puesta en marcha](#requisitos-y-puesta-en-marcha)
2. [Arquitectura de carpetas](#arquitectura-de-carpetas)
3. [Flujo de una petición HTTP](#flujo-de-una-petición-http)
4. [Middlewares en Express (terminología técnica)](#middlewares-en-express-terminología-técnica)
5. [Contrato de la API REST](#contrato-de-la-api-rest)
6. [Códigos de estado y manejo de errores](#códigos-de-estado-y-manejo-de-errores)
7. [Integración con el frontend](#integración-con-el-frontend)
8. [Limitaciones y posibles extensiones](#limitaciones-y-posibles-extensiones)

---

## Requisitos y puesta en marcha

- **Node.js** (versión LTS recomendada).
- Archivo **`.env`** en esta carpeta (`server/`) con la variable obligatoria:

```env
PORT=3000
```

Puedes copiar la plantilla:

```bash
cp .env.example .env
```

Instalación de dependencias y arranque en desarrollo (recarga con **nodemon**):

```bash
cd server
npm install
npm run dev
```

En consola deberías ver un mensaje similar a: `Servidor TaskFlow escuchando en http://localhost:3000`.

Abre en el navegador **`http://localhost:3000/`** (mismo puerto que la API): el servidor sirve también los archivos estáticos del proyecto (`index.html`, `src/`, `style.css`, etc.) con **`express.static`**, así no verás el mensaje *Cannot GET /* al visitar la raíz.

**Dependencias de producción utilizadas:**

| Paquete    | Rol |
|-----------|-----|
| `express` | Framework HTTP: enrutamiento, middlewares y respuestas. |
| `cors`    | Middleware que añade cabeceras CORS para permitir peticiones desde otros orígenes (p. ej. el frontend en otro puerto). |
| `dotenv`  | Carga variables de entorno desde `.env` al iniciar el proceso. |

**Desarrollo:**

| Paquete   | Rol |
|-----------|-----|
| `nodemon` | Reinicia el proceso Node cuando cambian archivos fuente. |

---

## Arquitectura de carpetas

```
server/
├── package.json           # Scripts npm y dependencias del servidor
├── package-lock.json
├── .env.example           # Plantilla de variables de entorno (sin secretos)
├── README.md              # Este documento
└── src/
    ├── index.js           # Bootstrap: app Express, cadena de middlewares, listen()
    ├── config/
    │   └── env.js         # Carga dotenv y exporta PORT (falla si falta)
    ├── routes/
    │   └── task.routes.js # Definición de rutas HTTP bajo /api/v1/tasks
    ├── controllers/
    │   └── task.controller.js  # Manejo de req/res: validación de entrada, códigos HTTP
    └── services/
        └── task.service.js     # Lógica de negocio y almacenamiento en memoria
```

**Responsabilidades:**

- **`index.js`**: crea la aplicación, registra middlewares globales, monta el router de tareas y define el **middleware de manejo de errores** (cuatro argumentos) al final de la cadena.
- **`routes/`**: declara qué función del controlador atiende cada método y ruta relativa al prefijo montado.
- **`controllers/`**: interpreta `req.body`, `req.params`, valida reglas básicas y delega en el servicio; traduce excepciones del dominio a respuestas HTTP o a `next(err)`.
- **`services/`**: no conoce Express; trabaja con datos y reglas de negocio (p. ej. “no encontrado”).
- **`config/`**: centraliza configuración leída del entorno para no esparcir `process.env` por el código.

---

## Flujo de una petición HTTP

1. El cliente (navegador, Postman, etc.) envía una petición a `http://localhost:PORT/api/v1/tasks` (o una subruta).
2. Express ejecuta los **middlewares** en el orden en que se registraron con `app.use()` / `app.METHOD()`.
3. Si una ruta coincide, se ejecuta el **controlador** asociado.
4. El controlador llama al **servicio** y envía la respuesta con `res.json()`, `res.status(...).end()`, etc.
5. Si en algún punto se llama a `next(err)` con un error, Express **omite** el resto de middlewares normales y salta al **middleware de error** (función con firma `(err, req, res, next)`).

---

## Middlewares en Express (terminología técnica)

En Express, un **middleware** es una función con la firma `(req, res, next)` (o `(err, req, res, next)` en el caso del manejador de errores) que puede:

- **Terminar** el ciclo respondiendo con `res.send`, `res.json`, etc., o
- **Pasar el control** invocando `next()` para que continúe la siguiente función en la pila, o
- **Propagar un error** con `next(err)` para activar el flujo de manejo de errores.

### Middlewares registrados en TaskFlow (orden relevante)

1. **`cors()`**  
   Middleware de terceros que intercepta la petición y, según la configuración, añade cabeceras como `Access-Control-Allow-Origin` para que un origen distinto al del servidor (p. ej. `http://127.0.0.1:5500`) pueda leer la respuesta desde JavaScript en el navegador.

2. **`express.json()`**  
   Middleware **incorporado** de Express que analiza cuerpos con `Content-Type: application/json` y rellena `req.body` con el objeto parseado. Sin él, el cuerpo llegaría como stream sin interpretar.

3. **`app.use('/api/v1/tasks', taskRoutes)`**  
   **Montaje de router**: todas las rutas definidas en `task.routes.js` quedan prefijadas con `/api/v1/tasks`. Internamente, el router sigue siendo una función middleware que Express invoca cuando el path coincide.

4. **`express.static(projectRoot)`**  
   Sirve archivos estáticos desde la **raíz del repositorio** (donde está `index.html`). Así, `GET /` devuelve la SPA y rutas como `/src/app.js` cargan el módulo del cliente sin necesidad de otro servidor HTTP.

5. **Middleware de error (cuatro parámetros)**  
   Va **al final** de la cadena (después del estático). Express lo distingue por la **aridad** (cuatro argumentos). Aquí se implementa el **mapeo semántico**: por ejemplo, un error con mensaje controlado `NOT_FOUND` se traduce en **404** sin filtrar detalles internos; el resto se registra con `console.error` y se responde **500** con un mensaje genérico para el cliente.

Este patrón evita que una excepción no capturada deje la respuesta colgada y centraliza la política de qué información se expone al cliente frente a lo que solo se registra en el servidor.

---

## Contrato de la API REST

**Base URL:** `http://localhost:<PORT>/api/v1/tasks`  
Todas las respuestas de error con cuerpo siguen el formato `{ "error": "mensaje" }` salvo donde se indique cuerpo vacío.

### `GET /api/v1/tasks`

Devuelve la lista de tareas.

**Respuesta 200:** array JSON. Cada elemento incluye:

| Campo         | Tipo    | Descripción |
|---------------|---------|-------------|
| `id`          | number  | Identificador único. |
| `titulo`      | string  | Texto de la tarea. |
| `estado`      | string  | `progreso`, `pendiente` o `completada`. |
| `categoria`   | string  | Etiqueta de categoría (p. ej. emoji + nombre). |
| `prioridad`   | string  | `alta`, `media` o `baja`. |
| `fechaLimite` | string \| null | Fecha límite en formato acordado con el cliente (p. ej. `YYYY-MM-DD`) o `null`. |
| `completada`  | boolean | Derivado: `true` si `estado === 'completada'` (conveniencia para clientes). |

**Ejemplo con curl:**

```bash
curl -s http://localhost:3000/api/v1/tasks
```

---

### `POST /api/v1/tasks`

Crea una tarea. Cuerpo JSON:

| Campo         | Obligatorio | Descripción |
|---------------|-------------|-------------|
| `titulo`      | Sí          | No puede ser cadena vacía ni solo espacios. |
| `estado`      | No          | `progreso`, `pendiente` o `completada` (por defecto `pendiente`). |
| `categoria`   | No          | Por defecto `📋 Gestión`. |
| `prioridad`   | No          | Por defecto `media`. |
| `fechaLimite` | No          | Opcional; `null` si no aplica. |

**Respuesta 201:** objeto de la tarea creada (mismo esquema que en GET).

**Ejemplo:**

```bash
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Revisar documentación\",\"estado\":\"progreso\",\"prioridad\":\"alta\",\"categoria\":\"💻 Desarrollo\"}"
```

---

### `PATCH /api/v1/tasks/:id`

Actualiza parcialmente una tarea. `:id` debe ser numérico. El cuerpo puede incluir cualquier subconjunto de:

- `titulo` (string no vacío tras recortar espacios)
- `estado` (`progreso` | `pendiente` | `completada`)
- `categoria` (string)
- `prioridad` (`alta` | `media` | `baja`)
- `fechaLimite` (string o vacío → se guarda como `null`)

Si el cuerpo no incluye ningún campo reconocido, se responde **400**.

**Respuesta 200:** objeto actualizado.

**Ejemplo (marcar como completada):**

```bash
curl -s -X PATCH http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"estado\":\"completada\"}"
```

---

### `DELETE /api/v1/tasks/:id`

Elimina la tarea con el `id` indicado.

**Respuesta 204:** sin cuerpo.

**Ejemplo:**

```bash
curl -i -X DELETE http://localhost:3000/api/v1/tasks/1
```

---

## Códigos de estado y manejo de errores

| Código | Situación típica |
|--------|------------------|
| **200** | `PATCH` correcto (cuerpo JSON con la tarea). |
| **201** | `POST` correcto. |
| **204** | `DELETE` correcto. |
| **400** | Validación de entrada (título faltante, ID no numérico, campos inválidos, cuerpo vacío en PATCH). |
| **404** | Recurso no encontrado (p. ej. `DELETE` o `PATCH` sobre un `id` inexistente) — error de negocio mapeado desde `NOT_FOUND`. |
| **500** | Error no previsto o fallo interno; el cliente recibe un mensaje **genérico** (`Error interno del servidor`) y el detalle técnico se escribe en consola del servidor con `console.error`. |

Los mensajes de validación concretos suelen devolverse en **400** desde el controlador; el middleware global refuerza ciertos códigos de error internos del servicio para no duplicar lógica en cada ruta.

---

## Integración con el frontend

El cliente web (en la raíz del monorepo) carga `src/api/client.js`, que usa **`fetch`** para hablar con esta API. La URL base por defecto es:

`http://localhost:3000/api/v1`

Se puede sobrescribir en el navegador definiendo antes de cargar el módulo:

```html
<script>window.TASKFLOW_API_BASE = 'http://localhost:3000/api/v1';</script>
```

**Requisitos prácticos:**

1. El servidor debe estar en ejecución con `PORT` coherente con la URL del cliente.
2. El HTML debe servirse por **HTTP(S)** (p. ej. Live Server, `npx serve`, etc.) para que los módulos ES y CORS funcionen de forma predecible; abrir el archivo como `file://` puede impedir peticiones al API.

La interfaz muestra estados de **carga** (indicador mientras hay peticiones), **éxito** (listas renderizadas) y **error** (mensaje visible ante fallos de red o respuestas 4xx/5xx), con botón **Reintentar** para volver a cargar las tareas.

---

## Limitaciones y posibles extensiones

- **Persistencia:** las tareas viven en un array en memoria; al reiniciar el proceso Node se pierden los datos.
- **Autenticación:** no hay usuarios ni tokens; cualquier cliente que alcance el puerto puede usar el API.
- **Base de datos:** sustituir `task.service.js` por acceso a SQL/NoSQL manteniendo la misma interfaz del servicio sería una evolución natural.
- **OpenAPI / Swagger:** generar un `openapi.yaml` describiendo estas rutas mejoraría la documentación interactiva y el contrato formal con el frontend.
- **Observabilidad:** integrar **Sentry** u otra herramienta enviaría los errores 500 a un panel centralizado en lugar de solo consola.

Para una visión más amplia de herramientas del ecosistema (Axios, Postman, Sentry, Swagger), consulta `docs/backend-api` en la raíz del repositorio.
