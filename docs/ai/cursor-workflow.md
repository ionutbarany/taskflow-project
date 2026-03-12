Los atajos que suelo usar con mas frecuencia en Cursor son:
Ctrl + I para abrir el Composer.
Ctrl + P para buscar un archivo rapidamente.
Ctrl + G para ir a una linea especifica.
Ctrl + / para comentar o descomentar una linea
Ctrl + Z para deshacer algun cambio.
Ctrl + Shift + Z para rehacer algun cambio.


Dos ejemplos concretos donde Cursor ha mejorado mi codigo es en la parte de localstorage y los contadores.

Resumen de mejoras que ha hecho Cursor en mi codigo.
Ha tocado solo app.js, manteniendo exactamente la misma UI y el mismo comportamiento normal:

cargarTareas más robusto: ahora, si el localStorage tiene datos corruptos o con un formato inesperado, la app no revienta; simplemente vuelve a usar tareasIniciales y muestra un console.warn, sin cambiar nada cuando los datos son correctos.

actualizarContadores más eficiente y claro: en lugar de hacer varios tasks.filter(...) para cada contador y categoría, ahora recorre la lista de tareas una sola vez y acumula todos los valores (totales, estados, prioridades y categorías) en un bucle, reduciendo trabajo innecesario pero generando los mismos números que antes.