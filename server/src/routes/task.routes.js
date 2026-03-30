const { Router } = require('express');
const taskController = require('../controllers/task.controller');

const router = Router();

router.get('/', taskController.obtenerTodas);
router.post('/', taskController.crearTarea);
router.patch('/:id', taskController.actualizarTarea);
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;
