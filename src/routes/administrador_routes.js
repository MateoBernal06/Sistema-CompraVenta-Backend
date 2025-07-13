import { Router } from "express";
import verificarAutenticacion from '../middlewares/autentificacion.js';
const router = Router();

import { 
    loginAdministrador,
    actualizarPassword,
    actualizarDatosAdministrador,
    administradorPerfil,
    comprobarTokenPasword,
    nuevoPassword
} from "../controllers/administrador_controller.js";

import {
    recuperarPassword,comprobarTokenPasword,nuevoPassword
} from "../controllers/estudiante_controller.js";

router.post("/administrador/login", loginAdministrador);
router.patch("/administrador/actualizar-password", verificarAutenticacion, actualizarPassword);
router.patch("/administrador/actualizar-datos", verificarAutenticacion, actualizarDatosAdministrador);
router.get("/administrador/perfil", verificarAutenticacion, administradorPerfil);

router.post("/recuperar-password", recuperarPassword);
router.get("/comprobar-token/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

export default router;