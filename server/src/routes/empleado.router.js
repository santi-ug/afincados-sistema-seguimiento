import { Router } from 'express';
import EmpleadoController from '../controllers/empleado.controller.js';

const router = Router();
const empleadoController = new EmpleadoController();

router.get('/', empleadoController.getAll);
router.get('/:id', empleadoController.getById);
router.post('/', empleadoController.create);
router.put('/:id', empleadoController.update);
router.delete('/:id', empleadoController.delete);

export default router;
