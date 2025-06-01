
import jwt from "jsonwebtoken";
import Administrador from "../models/administrador.js";
import Estudiante from "../models/estudiante.js"

// Método para proteger rutas
const verificarAutenticacion = async (req, res, next) => {
    // Validación si se está enviando el token
    if (!req.headers.authorization)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, debes proprocionar un token" });

    // Desestructurar el token pero del headers
    const { authorization } = req.headers;
    // Capturar errores

    try {
        // verificar el token recuperado con el almacenado
        const { id, rol } = jwt.verify(
            authorization.split(" ")[1],
            process.env.JWT_SECRET
        );

        // Verificar el rol
        if (rol === "administrador") {
            // Obtener el usuario
            req.AdministradorBDD = await Administrador.findById(id).lean().select("-password");
            req.estudianteBDD = await Estudiante.findById(id).lean().select("-password");
            // Continue el proceso
            next();
        } else {
            console.log(id, rol);
            req.estudianteBDD = await Estudiante.findById(id)
                .lean()
                .select("-password");
            console.log(req.estudianteBDD);
            next();
        }
    } catch (error) {
        // Capturar errores y presentarlos
        const e = new Error("Formato del token no válido");
        return res.status(404).json({ msg: e.message });
    }
};
// Exportar el método
export default verificarAutenticacion;