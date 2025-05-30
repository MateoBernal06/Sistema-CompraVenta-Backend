import Administrador from "../models/administrador.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/createJWT.js";

//! Sprint 1
//? Login
//-------------------------------------------------------------------
const loginAdministrador = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes(""))
        return res
        .status(404)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const administradorBDD = await Administrador.findOne({ email });

    if (!administradorBDD)
        return res
        .status(404)
        .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

    // Validar que el usuario tenga el rol de administrador
    if (administradorBDD.rol !== "administrador")
        return res
            .status(403)
            .json({ msg: "Acceso denegado: no tienes permisos de administrador" });

    const verificarPassword = await administradorBDD.matchPassword(password);

    if (!verificarPassword)
        return res
        .status(404)
        .json({ msg: "Lo sentimos, el password no es el correcto" });

    const token = generarJWT(administradorBDD._id, "administrador");

    const { nombre, apellido, email: emailA, celular, direccion, _id } = administradorBDD;

    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        emailA,
        celular,
        rol: "administrador",
        _id,
    });
};

export { loginAdministrador };