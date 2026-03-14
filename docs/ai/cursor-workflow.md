# Cursor — Configuración y uso del servidor MCP Filesystem

## Atajos de teclado más usados

| Atajo | Acción |
|-------|--------|
| `Ctrl + I` | Abrir el Composer |
| `Ctrl + P` | Buscar un archivo rápidamente |
| `Ctrl + G` | Ir a una línea específica |
| `Ctrl + /` | Comentar / descomentar una línea |
| `Ctrl + Z` | Deshacer un cambio |
| `Ctrl + Shift + Z` | Rehacer un cambio |

---

## Mejoras que Cursor ha hecho en el proyecto

Cursor tocó únicamente `app.js`, manteniendo exactamente la misma UI y el mismo comportamiento visible.

### `cargarTareas` — más robusto
Ahora, si el `localStorage` tiene datos corruptos o con un formato inesperado, la app no falla. Simplemente vuelve a usar `tareasIniciales` y muestra un `console.warn`, sin cambiar nada cuando los datos son correctos.

### `actualizarContadores` — más eficiente y claro
En lugar de hacer varios `tasks.filter(...)` para cada contador y categoría, ahora recorre la lista de tareas **una sola vez** y acumula todos los valores (totales, estados, prioridades y categorías) en un bucle, reduciendo trabajo innecesario pero generando los mismos números que antes.

---

## Instalación del servidor MCP Filesystem en Cursor

### Paso 1 — Instalar el paquete

Abre una terminal y ejecuta:

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

Esto instala globalmente en tu sistema el programa que actúa como puente entre Cursor y los archivos de tu proyecto. Sin él, el agente no sabría cómo acceder al filesystem.

### Paso 2 — Abrir los ajustes de Cursor

Usa el atajo `Ctrl + Shift + J` para abrir directamente los ajustes de Cursor.

### Paso 3 — Ir a la sección MCP

Dentro de los ajustes, localiza la pestaña **Tools & MCP** en la barra lateral.

### Paso 4 — Añadir el servidor

Haz clic en la opción para añadir un nuevo servidor MCP. Se abrirá un archivo `mcp.json` donde deberás escribir lo siguiente:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/ruta/absoluta/a/tu-proyecto"
      ]
    }
  }
}
```

> **Nota:** Reemplaza `/ruta/absoluta/a/tu-proyecto` con la ruta real de tu proyecto.

### Paso 5 — Verificar la instalación

Reinicia Cursor y vuelve a la pestaña **Tools & MCP**. Deberías ver el servidor `filesystem` instalado y activo.