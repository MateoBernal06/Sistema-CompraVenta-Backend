import { Router } from "express";
const router = Router();

import { loginAdministrador } from "../controllers/administrador_controller.js";

router.post("/administrador/login", loginAdministrador);


export default router;