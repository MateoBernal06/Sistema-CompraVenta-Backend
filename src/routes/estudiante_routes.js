
import { Router } from "express";
import verificarAutenticacion from '../middlewares/autentificacion.js';
import { 
    login, 
    registro, 
    confirmEmail, 
    recuperarPassword, 
    comprobarTokenPasword, 
    nuevoPassword,
    inactivarEstudiante,
    buscarEstudiante,
    verTodosEstudiantes,
    cambiarPassword,
    actualizarDatosEstudiante
} from "../controllers/estudiante_controller.js";


const router = Router();

router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.post("/recuperar-password", recuperarPassword);
router.get("/comprobar-token/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

router.patch("/estudiantes/:id", verificarAutenticacion, inactivarEstudiante);
router.get("/estudiantes/:email", verificarAutenticacion, buscarEstudiante);
router.get("/estudiantes", verificarAutenticacion, verTodosEstudiantes);
router.patch("/cambiar-password", verificarAutenticacion, cambiarPassword);
router.patch("/actualizar-datos", verificarAutenticacion, actualizarDatosEstudiante);

export default router;