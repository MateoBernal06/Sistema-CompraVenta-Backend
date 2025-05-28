import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const estudianteSchema = new Schema(
    {
        nombre: {
            type: String,
            require: true,
            trim: true,
        },
        apellido: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            trim: true,
        },
        direccion: {
            type: String,
            require: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
        },
        celular: {
            type: String,
            require: true,
            trim: true,
        },
        estado: {
            type: Boolean,
            default: true,
        },
        rol: {
            type: String,
            default: "estudiante",
        },
    },
    {
        timestamps: true,
    }
);

// Método para cifrar el password del estudiante
estudianteSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
estudianteSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

export default model("Estudiante", estudianteSchema);