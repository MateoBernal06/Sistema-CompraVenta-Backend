
import { Router } from "express";
//import verificarAutenticacion from "../middleware/autenticacion.js";
import { 
    login, 
    registro, 
    confirmEmail, 
    recuperarPassword, 
    comprobarTokenPasword, 
    nuevoPassword 
} from "../controllers/estudiante_controller.js";


const router = Router();

router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.post("/recuperar-password", recuperarPassword);
router.get("/comprobar-token/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

export default router;