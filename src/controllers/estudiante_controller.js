
import { sendMailToUser,sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../helpers/createJWT.js";
import Estudiante from "../models/estudiante.js";
import mongoose from "mongoose";


//! Sprint 1
//? Login, registro, confirmación de cuenta, recuperación de contraseña y cambio de contraseña
//-------------------------------------------------------------------

// Método para el login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const estudianteBDD = await Estudiante.findOne({ email }).select(
        "-status -__v -token -updatedAt -createdAt"
    );

    if (!estudianteBDD)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

    if (estudianteBDD.rol !== "estudiante")
        return res
            .status(403)
            .json({ msg: "Acceso denegado: no tienes permisos de estudiante" });

    if (estudianteBDD?.confirmEmail === false)
        return res
            .status(403)
            .json({ msg: "Lo sentimos, debe verificar su cuenta" });

    const verificarPassword = await estudianteBDD.matchPassword(password);

    if (!verificarPassword)
        return res
            .status(404)
            .json({ msg: "Lo sentimos, el password no es el correcto" });

    const token = generarJWT(estudianteBDD._id, "estudiante");

    const { nombre, apellido, celular, direccion, estado, _id } = estudianteBDD;

    res.status(200).json({
        token,
        nombre,
        apellido,
        celular,
        direccion,
        estado,
        _id,
        email: estudianteBDD.email,
        rol: "estudiante", // <--- AQUÍ ya estará definido correctamente
    });
};



// Método para el registro
const registro = async (req, res) => {
    // Desestructurar los campos
    const { email, password, celular, direccion, nombre, apellido } = req.body;

    // Validar todos los campos llenos
    if (Object.values(req.body).includes(""))
        return res
        .status(400)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    
    // Validar que el número de celular tenga 10 dígitos
    if (!/^\d{10}$/.test(celular))
        return res
            .status(400)
            .json({ msg: "El número de celular debe tener 10 dígitos" });
    
     // Validar que la contraseña tenga mínimo 6 caracteres
    if (!password || password.length < 6)
        return res
            .status(400)
            .json({ msg: "La contraseña debe tener al minimo 6 digitos" });

    // Obtener el usuario de la BDD en base al email
    const verificarEmailBDD = await Estudiante.findOne({ email });
    
    // Validar que el email sea nuevo
    if (verificarEmailBDD)
        return res
        .status(400)
        .json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

    // Crear la instancia del estudiante
    const nuevoEstudiante = new Estudiante(req.body);
    // Encriptar el password
    nuevoEstudiante.password = await nuevoEstudiante.encrypPassword(password);
    //Crear el token
    const token = nuevoEstudiante.crearToken();
    // Invocar la función para el envío de correo
    await sendMailToUser(email, token);
    // Guaradar en BDD
    await nuevoEstudiante.save();
    // Imprimir el mensaje
    res
        .status(200)
        .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};


// Método para confirmar el token
const confirmEmail = async (req, res) => {
    if (!req.params.token)
        return res
        .status(400)
        .json({ msg: "Lo sentimos, no se puede validar la cuenta" });

    const estudianteBDD = await Estudiante.findOne({ token: req.params.token });

    if (!estudianteBDD?.token)
        return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });

    estudianteBDD.token = null;
    estudianteBDD.confirmEmail = true;
    await estudianteBDD.save();

    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};


// Método para recuperar el password
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (Object.values(req.body).includes(""))
        return res
        .status(404)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    const estudianteBDD = await Estudiante.findOne({ email });
    if (!estudianteBDD)
        return res
        .status(404)
        .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    
    // Validar que el usuario tenga el rol de estudiante
    if (estudianteBDD.rol !== "estudiante")
        return res
            .status(403)
            .json({ msg: "Acceso denegado: solo estudiantes pueden recuperar contraseña" });
            
    const token = estudianteBDD.crearToken();
    estudianteBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await estudianteBDD.save();
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
    const estudianteBDD = await Estudiante.findOne({ token: req.params.token });
    if (estudianteBDD?.token !== req.params.token)
        return res
        .status(404)
        .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    await estudianteBDD.save();
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
    const estudianteBDD = await Estudiante.findOne({ token: req.params.token });
    
    if (estudianteBDD?.token !== req.params.token)
        return res
        .status(400)
        .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    estudianteBDD.token = null;
    estudianteBDD.password = await estudianteBDD.encrypPassword(password);
    await estudianteBDD.save();
    res
        .status(200)
        .json({
        msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
        });
};

export { registro, 
    confirmEmail, 
    recuperarPassword, 
    comprobarTokenPasword,
    nuevoPassword,
    login
};


