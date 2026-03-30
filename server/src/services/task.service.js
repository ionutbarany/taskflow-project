let tasks = [];
let nextId = 1;

const ESTADOS = new Set(['progreso', 'pendiente', 'completada']);
const PRIORIDADES = new Set(['alta', 'media', 'baja']);

function obtenerTodas() {
  return tasks.map(enriquecerRespuesta);
}

function enriquecerRespuesta(t) {
  return {
    ...t,
    completada: t.estado === 'completada',
  };
}

function crearTarea(data) {
  const estado = ESTADOS.has(data.estado) ? data.estado : 'pendiente';
  const prioridad = PRIORIDADES.has(data.prioridad) ? data.prioridad : 'media';

  const tarea = {
    id: nextId++,
    titulo: data.titulo,
    estado,
    categoria: typeof data.categoria === 'string' && data.categoria.trim() !== ''
      ? data.categoria
      : '📋 Gestión',
    prioridad,
    fechaLimite: data.fechaLimite || null,
  };
  tasks.push(tarea);
  return enriquecerRespuesta(tarea);
}

function actualizarTarea(id, patch) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  const t = tasks[index];

  if (patch.titulo !== undefined) {
    const titulo = String(patch.titulo).trim();
    if (titulo === '') {
      throw new Error('VALIDATION_TITULO');
    }
    t.titulo = titulo;
  }
  if (patch.estado !== undefined) {
    if (!ESTADOS.has(patch.estado)) {
      throw new Error('VALIDATION_ESTADO');
    }
    t.estado = patch.estado;
  }
  if (patch.categoria !== undefined) {
    t.categoria = String(patch.categoria);
  }
  if (patch.prioridad !== undefined) {
    if (!PRIORIDADES.has(patch.prioridad)) {
      throw new Error('VALIDATION_PRIORIDAD');
    }
    t.prioridad = patch.prioridad;
  }
  if (patch.fechaLimite !== undefined) {
    t.fechaLimite = patch.fechaLimite || null;
  }

  return enriquecerRespuesta(t);
}

function eliminarTarea(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(index, 1);
}

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
};
