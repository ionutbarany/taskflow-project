const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tareas = taskService.obtenerTodas();
  res.json(tareas);
}

function crearTarea(req, res) {
  const { titulo } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const tarea = taskService.crearTarea({ titulo: titulo.trim() });
  res.status(201).json(tarea);
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

module.exports = { obtenerTodas, crearTarea, eliminarTarea };
