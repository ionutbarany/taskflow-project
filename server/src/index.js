const path = require('path');
const { PORT } = require('./config/env');
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/task.routes');

const app = express();

const projectRoot = path.join(__dirname, '..', '..');

app.use(cors());
app.use(express.json());

app.use('/api/v1/tasks', taskRoutes);

app.use(express.static(projectRoot));

app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  if (
    err.message === 'VALIDATION_TITULO' ||
    err.message === 'VALIDATION_ESTADO' ||
    err.message === 'VALIDATION_PRIORIDAD'
  ) {
    return res.status(400).json({ error: 'Solicitud no válida' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor TaskFlow escuchando en http://localhost:${PORT}`);
  console.log(`Interfaz web: http://localhost:${PORT}/`);
});
