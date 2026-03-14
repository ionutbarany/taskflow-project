<div align="center">

# ◈ TaskFlow

### Gestiona tu día. Sin distracciones.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✦ ¿Qué es TaskFlow?

**TaskFlow** es un gestor de tareas personal construido desde cero con **HTML**, **CSS**, **JavaScript** puro y **Tailwind CSS** — sin frameworks, sin librerías de terceros y sin configuraciones innecesarias.

Está pensado para ayudarte a **organizar tu día de forma rápida y visual**, con una interfaz oscura y minimalista. Todo se guarda automáticamente en tu navegador, así que tus tareas se mantienen incluso después de cerrar la pestaña o recargar la página.

> Ideal para listas personales, seguimiento de proyectos pequeños, rutinas diarias o como base para aprender front-end moderno sin frameworks.

---

## 👀 Vista rápida

- Interfaz clara con columnas por estado
- Código de colores por prioridad
- Modo oscuro/claro con tu preferencia guardada
- Estadísticas en tiempo real para ver tu progreso semanal


---

## ⚡ Funcionalidades

- 🗂️ **Tres estados de tarea**
  - `En progreso`, `Pendiente` y `Completada`
- ➕ **Creación de tareas enriquecida**
  - Título, categoría y nivel de prioridad
- 🗑️ **Gestión sencilla**
  - Eliminar tareas con un solo click
- 🔴 🟡 🟢 **Sistema de prioridades visual**
  - Alta, Media y Baja con código de colores consistente
- 💾 **Persistencia total con `localStorage`**
  - Tus tareas sobreviven al refresco del navegador
- 🔍 **Búsqueda en tiempo real**
  - Filtrado instantáneo mientras escribes
- 📊 **Estadísticas en vivo**
  - Progreso semanal, tareas totales y contadores automáticos
- 🌙 **Modo oscuro / claro**
  - Toggle dedicado y preferencia guardada en el navegador
- 📱 **Diseño responsive**
  - Funciona de forma fluida en móvil, tablet y escritorio
- 🧩 **Arquitectura modular en JavaScript**
  - Separación de responsabilidades para facilitar mantenimiento y ampliaciones futuras

---

## 🛠️ Tecnologías

|   | Tecnología       | Uso                                              |
|---|------------------|---------------------------------------------------|
| 🧱 | HTML5           | Estructura semántica y accesible                  |
| 🎨 | CSS3            | Animaciones, estados complejos y keyframes        |
| ⚙️ | JavaScript ES6+ | DOM, eventos, lógica de negocio y LocalStorage    |
| 💨 | Tailwind CSS    | Sistema de diseño, utilidades y modo oscuro       |

> **Tailwind CSS** se integra mediante CDN con configuración personalizada en `tailwind.config.js`, extendiendo la paleta de colores y tipografías propias del proyecto.  
> El modo oscuro se gestiona con la estrategia `class`, activando o desactivando la clase `dark` en el elemento raíz desde JavaScript.

---

## 📁 Estructura del proyecto

```bash
taskflow/
├── 📄 index.html          → Estructura principal y clases de Tailwind
├── ⚙️  app.js             → Lógica dinámica completa (eventos, estados, storage)
├── 🎨 style.css           → Animaciones y estilos propios que complementan Tailwind
├── 🔧 tailwind.config.js  → Configuración de Tailwind (colores, fuentes, dark mode)
└── 📦 package.json        → Dependencias y scripts del proyecto
```

---

## 🚀 Cómo ejecutarlo

### Opción 1: Abrir directamente en el navegador

```bash
# 1. Clona el repositorio
git clone https://github.com/ionutbarany/taskflow.git

# 2. Entra en la carpeta del proyecto
cd taskflow

# 3. Abre el archivo en tu navegador
# En macOS:
open index.html

# En Windows:
start index.html

# En Linux (según navegador):
xdg-open index.html
```

### Opción 2: Servidor local (recomendado para desarrollo)

Si usas VS Code, puedes utilizar extensiones como **Live Server** o lanzar un servidor simple:

```bash
# Con Python 3
python -m http.server 8080
# Luego visita http://localhost:8080 en tu navegador
```

Sin instalación adicional de dependencias: es una SPA estática, lista para usarse.

---

## 🎯 Uso básico

1. **Crear una tarea**
   - Escribe el título, selecciona una categoría y asigna una prioridad.
   - Haz click en el botón de añadir.
2. **Cambiar de estado**
   - Mueve la tarea entre estados (Pendiente, En progreso, Completada) según tu flujo de trabajo.
3. **Buscar tareas**
   - Usa el campo de búsqueda para filtrar por texto en tiempo real.
4. **Cambiar tema**
   - Alterna entre modo oscuro y claro con el toggle; la preferencia queda guardada.
5. **Revisar tu progreso**
   - Consulta los contadores y estadísticas para ver cómo estás avanzando durante la semana.

---

## 🧠 Arquitectura y decisiones clave

- **SPA sin frameworks**: todo el flujo ocurre en una sola página, manipulando el DOM con JavaScript puro.
- **Estado sincronizado con `localStorage`**: el estado de las tareas se serializa/deserializa en cada cambio relevante.
- **Diseño orientado a componentes visuales**: aunque no se usan frameworks, la UI se organiza en bloques claros (cabecera, formulario, columnas de tareas, estadísticas).
- **Modo oscuro basado en clases**: se evita depender de `prefers-color-scheme` exclusivamente, dando control directo al usuario.

---

## 📚 ¿Qué aprendí con este proyecto?

- Manipulación dinámica del **DOM** con `createElement`, `appendChild`, `remove` y manejo de atributos/clases.
- Gestión de **eventos** con `addEventListener` para formularios, botones, toggles y campos de búsqueda.
- **Persistencia de datos** con `localStorage`, `JSON.stringify` y `JSON.parse`.
- Integración de **Tailwind CSS** vía CDN y uso del prefijo `dark:` para temas dinámicos.
- Diseño de sistemas de color con **variables CSS** y extensión de la configuración de Tailwind.
- Arquitectura de una **SPA** sin frameworks, estructurando la lógica en funciones reutilizables.

---

## 🧩 Próximos pasos / Roadmap

- ⏰ Recordatorios o fechas límite opcionales para las tareas.
- 🔔 Notificaciones in-app para tareas próximas a vencer.
- 🏷️ Etiquetas personalizables y filtros avanzados.
- 🌐 Internacionalización (i18n) para otros idiomas además de español.
- ✅ Tests básicos de la lógica con algún framework de testing ligero.

---

## 🤝 Cómo contribuir

Las contribuciones son bienvenidas. Algunas formas de ayudar:

1. Haz un **fork** del repositorio.
2. Crea una rama para tu mejora o corrección de bug:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y asegúrate de que la app sigue funcionando correctamente.
4. Abre un **Pull Request** explicando claramente:
   - El problema que resuelves o la mejora que introduces.
   - Capturas de pantalla si tu cambio afecta a la UI.

---

<div align="center">

Gracias por echarle un ojo a **TaskFlow** ✦  
Si te resulta útil, no dudes en adaptarlo o ampliarlo a tu propio flujo de trabajo.

</div>

