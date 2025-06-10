import { Schema, model } from "mongoose";

const categoriaSchema = new Schema(
    {
        nombre: {
            type: String,
            require: true,
            trim: true,
        },
        descripcion: {
            type: String,
            require: true,
            trim: true,
        },
        estado: {
            type: Boolean,
            default: true,
        },
        administrador: { 
            type: Schema.Types.ObjectId,
            ref: "Administrador",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Categoria", categoriaSchema);
