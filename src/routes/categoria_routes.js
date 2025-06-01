
import { Router } from 'express';
import verificarAutenticacion from '../middlewares/autentificacion.js';
import { 
    crearCategoria, 
    verTodasCategorias,
    verCategoria,
    actualizarCategoria,
    inactivarCategoria
} from '../controllers/categoria_controller.js';

const router = Router();

router.post('/categoria', verificarAutenticacion, crearCategoria);
router.get('/categoria', verificarAutenticacion, verTodasCategorias);
router.get('/categoria/:nombre', verificarAutenticacion, verCategoria);
router.put('/categoria/:id', verificarAutenticacion, actualizarCategoria);
router.patch('/categoria/:id', verificarAutenticacion, inactivarCategoria);

export default router;
