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

         // Obtener el administrador desde el middleware
        const administradorId = req.AdministradorBDD?._id;
        if (!administradorId) {
            return res
            .status(403)
            .json({ msg: 'Acceso denegado. Solo un administrador puede crear categorías.' });
        }

        // Crear y guardar la categoría
        const categoria = new Categoria({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            administrador: administradorId,
        });

        await categoria.save();
        res.status(201).json(categoria);

    } catch (err) {
        /*res.status(400).json({ error: 'Error al crear la categoría' });*/
        console.error(err); // 👈 Imprime el error en consola
        res.status(400).json({ error: 'Error al crear la categoría', detalle: err.message });
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
        const categoriaInactivada = await Categoria.findByIdAndUpdate(id);
        if (!categoriaInactivada) {
            return res
                .status(404)
                .json({ msg: 'Categoría no encontrada' });
        }

        categoriaInactivada.estado = !categoriaInactivada.estado; 
        await categoriaInactivada.save();

        const mensaje = categoriaInactivada.estado
            ? 'Categoría activada exitosamente'
            : 'Categoría inactivada exitosamente';

        res
            .status(200)
            .json({
                msg: mensaje
            });

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