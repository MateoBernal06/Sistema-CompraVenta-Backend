import Administrador from "../models/administrador.js";
import mongoose from "mongoose";
import generarJWT from "../helpers/createJWT.js";

//! Sprint 1
//? Login
//-------------------------------------------------------------------
const loginAdministrador = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (Object.values(req.body).includes(""))
            return res
            .status(400)
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

        const { _id } = administradorBDD;

        res.status(200).json({
            token,
            rol: "administrador",
            _id,
        });
    } catch (error) {
        console.error("Error en loginAdministrador:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};


// Método para recuperar el password
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (Object.values(req.body).includes(""))
        return res
            .status(404)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    const administradorBDD = await Administrador.findOne({ email });
    if (!administradorBDD)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

    const token = administradorBDD.crearToken();
    administradorBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await administradorBDD.save();
    res
        .status(200)
        .json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
};


// Método para comprobar el token
const comprobarTokenPasword = async (req, res) => {
    if (!req.params.token)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    const administradorBDD = await Administrador.findOne({ token: req.params.token });
    if (administradorBDD?.token !== req.params.token)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    await administradorBDD.save();
    res
        .status(200)
        .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};


// Método para crear el nuevo password
const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    if (Object.values(req.body).includes(""))
        return res
        .status(404)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });

    // Validar que la contraseña tenga mínimo 6 caracteres
    if (!password || password.length < 6)
        return res
            .status(400)
            .json({ msg: "La contraseña debe tener al menos 6 caracteres" });

    if (password != confirmpassword)
        return res
        .status(400)
        .json({ msg: "Lo sentimos, los passwords no coinciden" });
    const administradorBDD = await Administrador.findOne({ token: req.params.token });

    if (administradorBDD?.token !== req.params.token)
        return res
        .status(400)
        .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    administradorBDD.token = null;
    administradorBDD.password = await administradorBDD.encrypPassword(password);
    await administradorBDD.save();
    res
        .status(200)
        .json({
        msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
        });
};


const actualizarPassword = async (req, res) => {
    
    const { passwordActual, nuevaPassword, repetirPassword } = req.body;

    // Validar que todos los campos estén llenos y no sean solo espacios
    if (
        !passwordActual || !nuevaPassword || !repetirPassword ||
        passwordActual.trim() === "" || nuevaPassword.trim() === "" || repetirPassword.trim() === ""
    ) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Validar que la nueva contraseña tenga al menos una mayúscula
    if (!/[A-Z]/.test(nuevaPassword)) {
        return res.status(400).json({ msg: "La contraseña debe tener al menos una letra mayúscula" });
    }

    // Validar que la nueva contraseña tenga al menos un número
    if (!/\d/.test(nuevaPassword)) {
        return res.status(400).json({ msg: "La contraseña debe contener al menos un número" });
    }

    // Validar que la nueva contraseña tenga al menos 8 caracteres
    if (nuevaPassword.length < 8) {
        return res.status(400).json({ msg: "La nueva contraseña debe tener al menos 8 caracteres" });
    }

    // Validar que las nuevas contraseñas coincidan
    if (nuevaPassword !== repetirPassword) {
        return res.status(400).json({ msg: "Las nuevas contraseñas no coinciden" });
    }

    // Buscar al administrador autenticado
    if (!req.AdministradorBDD || !req.AdministradorBDD._id) {
        return res.status(401).json({ msg: "No autorizado" });
    }

    const admin = await Administrador.findById(req.AdministradorBDD._id);
    if (!admin) {
        return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Validar la contraseña actual
    const passwordValido = await admin.matchPassword(passwordActual);
    if (!passwordValido) {
        return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
    }

    // Cambiar la contraseña
    admin.password = await admin.encrypPassword(nuevaPassword);
    await admin.save();

    res.status(200).json({ msg: "Contraseña actualizada exitosamente" });

};


const actualizarDatosAdministrador = async (req, res) => {
    try {
        const { nombre, apellido, celular, direccion } = req.body;

        // Validar que todos los campos estén llenos y no sean solo espacios
        if (
            !nombre || !apellido || !celular || !direccion ||
            nombre.trim() === "" || apellido.trim() === "" || celular.trim() === "" || direccion.trim() === ""
        ) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        // Validar que el número de celular tenga 10 dígitos
        if (!/^\d{10}$/.test(celular)) {
            return res.status(400).json({ msg: "El número de celular debe tener 10 dígitos" });
        }

        // Buscar al administrador autenticado
        if (!req.AdministradorBDD || !req.AdministradorBDD._id) {
            return res.status(401).json({ msg: "No autorizado" });
        }
        const admin = await Administrador.findById(req.AdministradorBDD._id);
        if (!admin) {
            return res.status(404).json({ msg: "Administrador no encontrado" });
        }

        // Validar si los datos son los mismos
        if (
            admin.nombre === nombre &&
            admin.apellido === apellido &&
            admin.celular === celular &&
            admin.direccion === direccion
        ) {
            return res.status(200).json({ msg: "No se realizaron cambios, los datos son los mismos." });
        }

        // Actualizar los datos del administrador
        admin.nombre = nombre;
        admin.apellido = apellido;
        admin.celular = celular;
        admin.direccion = direccion;

        await admin.save();

        res.status(200).json({ msg: "Datos actualizados exitosamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar los datos" });
    }
};


const administradorPerfil = async (req, res) => {
    try {
        if (!req.AdministradorBDD) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        // Puedes excluir campos sensibles si lo deseas
        const { password, ...datos } = req.AdministradorBDD;
        res.status(200).json(datos);

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los datos del usuario" });
    }
};


export {
    loginAdministrador,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    actualizarPassword,
    actualizarDatosAdministrador,
    administradorPerfil
};