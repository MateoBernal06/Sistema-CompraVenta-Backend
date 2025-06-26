
import { sendMailToUser,sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../helpers/createJWT.js";
import Estudiante from "../models/estudiante.js";
import mongoose from "mongoose";


//! Sprint 1
//? Login, registro, confirmación de cuenta, recuperación de contraseña y cambio de contraseña
//-------------------------------------------------------------------

// Método para el login
const login = async (req, res) => {
    try{
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

        // Validar si el usuario está inactivado
        if (estudianteBDD.estado === false)
            return res
                .status(403)
                .json({ msg: "Tu cuenta está inactiva. Comunícate con el administrador." });

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
            _id,
            rol: "estudiante"
        });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
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
    if (!password || password.length < 8)
        return res
            .status(400)
            .json({ msg: "La contraseña debe tener minimo 8 digitos" });


    // Validar que la nueva contraseña tenga al menos un número
    if (!/\d/.test(password))
        return res
            .status(400)
            .json({ msg: "La contraseña debe contener al menos un número" });


    // Validar que la nueva contraseña tenga al menos una mayúscula
    if (!/[A-Z]/.test(password))
        return res
            .status(400)
            .json({ msg: "La contraseña debe contener al menos una mayúscula" });

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
        return res
                .status(404)
                .json({ msg: "La cuenta ya ha sido confirmada" });

    estudianteBDD.token = null;
    estudianteBDD.confirmEmail = true;
    await estudianteBDD.save();

    res
        .status(200)
        .json({ msg: "Token confirmado, ya puedes iniciar sesión" });
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


const verTodosEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        res
            .status(200)
            .json(estudiantes);
    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al obtener los estudiantes' });
    }
}


const buscarEstudiante = async (req, res) => {
    const { email } = req.params;

    try {
        const estudiante = await Estudiante.findOne({ email });
        if (!estudiante) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' });
        }
        res
            .status(200)
            .json(estudiante);

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al obtener el estudiante' });
    }
}


const inactivarEstudiante = async (req, res) => {
    const { id } = req.params;
        
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ msg: 'ID no válido' });
    }

    try {
        const estudianteInactivado = await Estudiante.findByIdAndUpdate(id);
        if (!estudianteInactivado) {
            return res
                .status(404)
                .json({ msg: 'Estudiante no encontrado' });
        }

        estudianteInactivado.estado = !estudianteInactivado.estado; 
        await estudianteInactivado.save();

        const mensaje = estudianteInactivado.estado
            ? 'Estudiante activado exitosamente'
            : 'Estudiante inactivado exitosamente';

        res
            .status(200)
            .json({
                msg: mensaje
            });

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al inactivar el estudiante' });
    }
}


const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, nuevaPassword, repetirPassword } = req.body;

        // Validar que todos los campos estén llenos y no sean solo espacios
        if (!passwordActual || !nuevaPassword || !repetirPassword ||
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

        // Buscar al usuario autenticado
        const estudiante = await Estudiante.findById(req.estudianteBDD._id);
        if (!estudiante) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Validar la contraseña actual
        const passwordValido = await estudiante.matchPassword(passwordActual);
        if (!passwordValido) {
            return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
        }

        // Cambiar la contraseña
        estudiante.password = await estudiante.encrypPassword(nuevaPassword);
        await estudiante.save();

        res.status(200).json({ msg: "Contraseña actualizada exitosamente" });
    
    } catch (error) {
        res.status(500).json({ msg: "Error al cambiar la contraseña" });
    }
};


const actualizarDatosEstudiante = async (req, res) => {
    
    try {
        const { nombre, apellido, celular, direccion } = req.body;

        // Validar que todos los campos estén llenos y no sean solo espacios
        if (!nombre || !apellido || !celular || !direccion ||
            nombre.trim() === "" || apellido.trim() === "" || celular.trim() === "" || direccion.trim() === ""
        ) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        // Validar que el número de celular tenga 10 dígitos
        if (!/^\d{10}$/.test(celular))
            return res
                .status(400)
                .json({ msg: "El número de celular debe tener 10 dígitos" });


        // Buscar al usuario autenticado
        const estudiante = await Estudiante.findById(req.estudianteBDD._id);
        if (!estudiante) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Validar si los datos son los mismos
        if (
            estudiante.nombre === nombre &&
            estudiante.apellido === apellido &&
            estudiante.celular === celular &&
            estudiante.direccion === direccion
        ) {
            return res.status(200).json({ msg: "No se realizaron cambios, los datos son los mismos." });
        }

        // Actualizar los datos del estudiante
        estudiante.nombre = nombre;
        estudiante.apellido = apellido;
        estudiante.celular = celular;
        estudiante.direccion = direccion;

        await estudiante.save();

        res.status(200).json({ msg: "Datos actualizados exitosamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar los datos" });
    }
}


const estudiantePerfil = async (req, res) => {
    try {
        // req.estudianteBDD debe estar definido por el middleware de autenticación
        if (!req.estudianteBDD) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        // Puedes excluir campos sensibles si lo deseas
        const { password, ...datos } = req.estudianteBDD;
        res.status(200).json(datos);

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los datos del usuario" });
    }
}

export { 
    registro, 
    confirmEmail, 
    recuperarPassword, 
    comprobarTokenPasword,
    nuevoPassword,
    login,
    verTodosEstudiantes,
    buscarEstudiante,
    inactivarEstudiante,
    cambiarPassword,
    actualizarDatosEstudiante,
    estudiantePerfil
};


