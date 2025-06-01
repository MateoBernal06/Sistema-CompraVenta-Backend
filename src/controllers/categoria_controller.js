import Categoria from '../models/categoria.js';
import mongoose from "mongoose";


const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validar campos vacíos
        if (!nombre || !descripcion || nombre.trim() === "" || descripcion.trim() === "") {
            return res
                .status(400)
                .json({ msg: 'Todos los campos son obligatorios' });
        }

        // Validar que el nombre de la categoría no se repita
        const categoriaExistente = await Categoria.findOne({ nombre: nombre.trim() });
        if (categoriaExistente) {
            return res
                .status(400)
                .json({ msg: 'El nombre de la categoría ya existe' });
        }

        const categoria = new Categoria({ nombre, descripcion });
        await categoria.save();
        res.status(201).json(categoria);

    } catch (err) {
        res.status(400).json({ error: 'Error al crear la categoría' });
    }
}

const verTodasCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res
            .status(200)
            .json(categorias);
    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al obtener las categorías' });
    }
}

const verCategoria = async (req, res) => {
    const { nombre } = req.params;

    try {
        const categoria = await Categoria.findOne({ nombre });
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }
        res
            .status(200)
            .json(categoria);

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al obtener la categoría' });
    }
}

const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        // Validar campos vacíos
        if (!nombre || !descripcion || nombre.trim() === "" || descripcion.trim() === "") {
            return res
                .status(400)
                .json({ msg: 'Todos los campos son obligatorios' });
        }

        // Validar que el nombre de la categoría no se repita
        const categoriaExistente = await Categoria.findOne({ nombre: nombre.trim(), _id: { $ne: id } });
        if (categoriaExistente) {
            return res
                .status(400)
                .json({ msg: 'El nombre de la categoría ya existe' });
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });
        if (!categoriaActualizada) {
            return res
                .status(404)
                .json({ msg: 'Categoría no encontrada' });
        }
        res
            .status(200)
            .json(categoriaActualizada);

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al actualizar la categoría' });
    }
}

const inactivarCategoria = async (req, res) => {
    const { id } = req.params;
    
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ msg: 'ID no válido' });
    }

    try {
        const categoriaInactivada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!categoriaInactivada) {
            return res
                .status(404)
                .json({ msg: 'Categoría no encontrada' });
        }
        res
            .status(200)
            .json(categoriaInactivada);

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al inactivar la categoría' });
    }
};


export { 
    crearCategoria, 
    verTodasCategorias, 
    verCategoria,
    actualizarCategoria,
    inactivarCategoria
};