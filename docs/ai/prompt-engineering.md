10 Prompts utiles para pedir a la IA teniendo en cuenta mi proyecto.

1. Migración de datos seguros entre versiones

"En app.js tengo la clave taskflow-v2 en localStorage. Escribe una función de migración que detecte si existe taskflow-v1 (o cualquier clave antigua) y migre los datos al nuevo formato automáticamente sin perder tareas."

¿Por qué es util este prompt? Mi app ya gestiona versiones (v2), lo que indica que puede evolucionar. Sin migración, los usuarios perderán sus tareas al actualizar el schema.

2. Filtros combinados por prioridad y categoría

"En app.js existe aplicarBusqueda() que solo filtra por título. Extiéndela para que también filtre por prioridad (alta, media, baja) y por categoría (Desarrollo, Deporte, Gestión, Investigación) de forma combinada."

¿Por qué es util este prompt? Ya tengo los datos de prioridad y categoría en cada tarea. Solo falta exponer esos filtros en la UI, y la lógica base ya existe.

3. Reordenamiento de tareas por arrastrar

"Las tareas se renderizan en listProgreso, listPendiente y listCompletada. Añade drag & drop nativo con la API HTML5 draggable para reordenar tareas dentro de una columna y moverlas entre columnas cambiando su estado."

¿Por qué es util este prompt? Es la funcionalidad más demandada en Kanbans. La arquitectura ya tiene columnas separadas por estado, el movimiento entre ellas encajaría perfectamente.

4. Sistema de edición inline de tareas

"Actualmente al hacer click en una card se cambia su estado a completada. Añade un botón de edición que abra el modal existente (#modal) pero con los datos de la tarea precargados, permitiendo editar título, categoría y prioridad."

¿Por qué es util este prompt? El modal ya existe y funciona para creación. Reutilizarlo para edición es una mejora de alta demanda con muy poco coste de desarrollo.

5. Dark mode: Variables CSS centralizadas

"En style.css los colores del modo oscuro están hardcodeados como hex (#1e2230, #272c3a, etc.) en múltiples selectores. Refactorizar usando variables CSS (:root y .dark) para centralizar la paleta y facilitar futuros cambios de tema."

¿Por qué seria util el prompt? Tengo 8 valores de color repetidos en distintos selectores. Un cambio de paleta hoy requeriría editar múltiples líneas.

6. Animación de eliminación de tareas

"Cuando se elimina una card con .btn-delete, desaparece inmediatamente con div.remove(). Añade una animación de salida CSS (@keyframes) que deslice o desvanezca la card antes de eliminarla del DOM."

¿Por qué? Ya tengo cardEntrada definida en el CSS. La animación de salida es su complemento natural y mejora mucho la percepción de calidad de la app.

7. Gráfico de productividad semanal

"La función actualizarContadores() en app.js calcula estadísticas pero no guarda histórico. Añade un sistema que registre en localStorage cuántas tareas se completaron cada día de la semana, y muestra un mini gráfico de barras SVG con los últimos 7 días."

¿Por qué? Ya muestro estadísticas en tiempo real. Añadir una dimensión temporal con SVG puro (sin librerías) encajaría con tu filosofía de cero dependencias.

8. Exportar tareas como JSON o CSV

"Añade un botón en la UI que exporte el array tasks actual como archivo JSON descargable, y opcionalmente como CSV con columnas: id, titulo, categoria, prioridad, estado."

¿Por qué? Los datos viven solo en localStorage, lo que significa que limpiar el navegador los borra para siempre. Una exportación manual es el backup más sencillo posible.

9. Añadir fechas límite a las tareas

"El objeto de tarea en tareasIniciales tiene: id, titulo, categoria, prioridad, estado. Extiende el schema añadiendo un campo fechaLimite opcional, actualiza el modal para incluir un <input type="date"> y muestra un badge de ⚠️ Vence hoy en las cards próximas a vencer."

¿Por qué? Es la extensión más natural de un gestor de tareas. El schema es simple y plano, lo que hace que añadir un campo nuevo sea trivial y no rompa nada existente.

10. Tests unitarios para las funciones puras

"Las funciones cargarTareas(), guardarTareas(), capitalizar() y actualizarContadores() en app.js son candidatas a tests unitarios. Escribe un suite de tests con Vitest o Jest que cubra los casos límite: localStorage vacío, JSON corrupto y tareas con campos faltantes."

¿Por qué? El README menciona explícitamente que manejas datos corruptos en localStorage. Ya identificaste el caso límite tú mismo, lo que significa que ya sabes que puede fallar. Un test lo blindaría.