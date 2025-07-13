import { Router } from "express";
import verificarAutenticacion from '../middlewares/autentificacion.js';
const router = Router();

import { 
    loginAdministrador,
    actualizarPassword,
    actualizarDatosAdministrador,
    administradorPerfil
} from "../controllers/administrador_controller.js";


router.post("/administrador/login", loginAdministrador);
router.patch("/administrador/actualizar-password", verificarAutenticacion, actualizarPassword);
router.patch("/administrador/actualizar-datos", verificarAutenticacion, actualizarDatosAdministrador);
router.get("/administrador/perfil", verificarAutenticacion, administradorPerfil);

export default router;