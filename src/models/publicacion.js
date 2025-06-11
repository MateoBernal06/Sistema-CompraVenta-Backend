import { Schema, model } from "mongoose";

const publicacionSchema = new Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        autor: {
            type: Schema.Types.ObjectId,
            ref: 'Estudiante',
            required: true,
        },
        categoria: {
            type: Schema.Types.ObjectId,
            ref: 'Categoria',
            required: true,
        },
        imagen: {
            type: String,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
            min: 0,
        },
        estado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model('Publicacion', publicacionSchema);