
import { Router } from 'express';
import upload from '../config/multer.js';
import verificarAutenticacion from '../middlewares/autentificacion.js';
import { 
    crearPublicacion,
    obtenerPublicaciones,
    verPublicacion,
    actualizarPublicacion,
    inactivarPublicacion,
    misPublicaciones, 
    eliminarPublicacion, 
    verPublicacionPorId
} from '../controllers/publicacion_controller.js';

const router = Router();

router.post('/publicacion', verificarAutenticacion, upload.single('imagen'), crearPublicacion);
router.get('/publicacion', verificarAutenticacion, obtenerPublicaciones);
router.get('/publicacion/:titulo', verificarAutenticacion, verPublicacion);
router.get('/publicacion-user', verificarAutenticacion, misPublicaciones);
router.put('/publicacion/:id', verificarAutenticacion, actualizarPublicacion);
router.patch('/publicacion/:id', verificarAutenticacion, inactivarPublicacion);
router.delete('/publicacion/:id', verificarAutenticacion, eliminarPublicacion);
router.get('/publicacion/detalle/:id', verificarAutenticacion, verPublicacionPorId);

export default router;