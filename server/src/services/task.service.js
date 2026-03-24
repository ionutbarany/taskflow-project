let tasks = [];
let nextId = 1;

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const tarea = {
    id: nextId++,
    titulo: data.titulo,
    completada: false,
  };
  tasks.push(tarea);
  return tarea;
}

function eliminarTarea(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(index, 1);
}

module.exports = { obtenerTodas, crearTarea, eliminarTarea };
