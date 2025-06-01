
import { Router } from 'express';
import { 
    crearCategoria, 
    verTodasCategorias,
    verCategoria,
    actualizarCategoria,
    inactivarCategoria
} from '../controllers/categoria_controller';

const router = Router();

router.post('/categoria', crearCategoria);
router.get('/categoria', verTodasCategorias);
router.get('/categoria/:nombre', verCategoria);
router.put('/categoria/:id', actualizarCategoria);
router.patch('/categoria/:id', inactivarCategoria);

export default router;
