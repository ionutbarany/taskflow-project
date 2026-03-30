const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tareas = taskService.obtenerTodas();
  res.json(tareas);
}

function crearTarea(req, res) {
  const { titulo, estado, categoria, prioridad, fechaLimite } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const tarea = taskService.crearTarea({
    titulo: titulo.trim(),
    estado,
    categoria,
    prioridad,
    fechaLimite,
  });
  res.status(201).json(tarea);
}

function actualizarTarea(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  const body = req.body || {};
  const patch = {};
  if (body.titulo !== undefined) patch.titulo = body.titulo;
  if (body.estado !== undefined) patch.estado = body.estado;
  if (body.categoria !== undefined) patch.categoria = body.categoria;
  if (body.prioridad !== undefined) patch.prioridad = body.prioridad;
  if (body.fechaLimite !== undefined) patch.fechaLimite = body.fechaLimite;

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
  }

  try {
    const tarea = taskService.actualizarTarea(id, patch);
    res.json(tarea);
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return next(err);
    }
    if (err.message === 'VALIDATION_TITULO') {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    if (err.message === 'VALIDATION_ESTADO') {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    if (err.message === 'VALIDATION_PRIORIDAD') {
      return res.status(400).json({ error: 'Prioridad no válida' });
    }
    next(err);
  }
}

function eliminarTarea(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { obtenerTodas, crearTarea, actualizarTarea, eliminarTarea };
