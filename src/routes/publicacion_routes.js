
import { Router } from 'express';
import verificarAutenticacion from '../middlewares/autentificacion.js';
import { 
    crearPublicacion,
    obtenerPublicaciones,
    verPublicacion,
    actualizarPublicacion,
    inactivarPublicacion
} from '../controllers/publicacion_controller.js';

const router = Router();

router.post('/publicacion', verificarAutenticacion, crearPublicacion);
router.get('/publicacion', verificarAutenticacion, obtenerPublicaciones);
router.get('/publicacion/:titulo', verificarAutenticacion, verPublicacion);
router.put('/publicacion/:id', verificarAutenticacion, actualizarPublicacion);
router.patch('/publicacion/:id', verificarAutenticacion, inactivarPublicacion);

export default router;