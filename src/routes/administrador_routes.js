import { Router } from "express";
import verificarAutenticacion from '../middlewares/autentificacion.js';
const router = Router();

import { 
    loginAdministrador,
    actualizarPassword,
    actualizarDatosAdministrador
} from "../controllers/administrador_controller.js";

router.post("/administrador/login", loginAdministrador);
router.patch("/administrador/actualizar-password", verificarAutenticacion, actualizarPassword);
router.patch("/administrador/actualizar-datos", verificarAutenticacion, actualizarDatosAdministrador);

export default router;