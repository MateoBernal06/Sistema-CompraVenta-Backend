
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const administradorSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        apellido: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        celular: {
            type: String,
            trim: true,
            default: null,
        },
        password: {
            type: String,
            required: true,
        },
        rol: {
            type: String,
            default: "administrador",
        },
    },
    {
        timestamps: true,
    }
);

// Método para cifrar el password del administrador
administradorSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
administradorSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

export default model("Administrador", administradorSchema);