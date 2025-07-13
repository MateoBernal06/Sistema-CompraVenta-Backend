
import mongoose from "mongoose";
import Publicacion from "../models/publicacion.js";
import Estudiante from "../models/estudiante.js";
import Categoria from "../models/categoria.js";

const crearPublicacion = async (req, res) => {
    try {
        const { titulo, descripcion, categoria, precio } = req.body;

        // Validar campos vacíos
        if (!titulo || !descripcion || !categoria || !precio) {
            return res
                .status(400)
                .json({ msg: "Todos los campos son obligatorios" });
        }

        // Obtener el id del autor autenticado
        const autor = req.estudianteBDD?._id;
        if (!autor) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        // Validar que el autor exista en la base de datos
        const autorExiste = await Estudiante.findById(autor);
        if (!autorExiste) {
            return res.status(404).json({ msg: "El autor no existe" });
        }

        // Validar que la categoría sea ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res
                .status(400)
                .json({ msg: "Categoría inválida" });
        }

        // Validar que la categoría exista en la base de datos
        const categoriaExiste = await Categoria.findById(categoria);
        if (!categoriaExiste) {
            return res.status(404).json({ msg: "La categoría no existe" });
        }

        // Validar que el precio sea un número positivo
        /*if (typeof precio !== 'number' || precio < 0) {
            return res
                .status(400)
                .json({ msg: "El precio debe ser un número positivo" });
        }*/

        // Validar que la imagen exista
        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: "La imagen es obligatoria" });
        }

        // Crear y guardar la nueva publicación
        const nuevaPublicacion = new Publicacion({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            autor: autor,
            categoria: categoria,
            imagen: req.file.path,
            precio: precio.trim()
        });

        await nuevaPublicacion.save();
        res.status(201).json(nuevaPublicacion);

    } catch (error) {
        res
            .status(500)
            .json({ msg: `Error al crear la publicación`, error: error.message });
            
    }
}


const obtenerPublicaciones = async (req, res) => {
    try {
        let publicaciones;

        if (req.AdministradorBDD && req.AdministradorBDD.rol === "administrador") {
            publicaciones = await Publicacion.find()
                .populate('autor')
                .populate('categoria')
                .sort({ titulo: 1 });
        } else {
            publicaciones = await Publicacion.find({ disponible: true })
                .populate('autor')
                .populate('categoria')
                .sort({ createdAt: -1 });
        }

        res.status(200).json(publicaciones);

    } catch (error) {
        res
            .status(500)
            .json({ msg: "Error al obtener las publicaciones"});
    }
}


const verPublicacion = async (req, res) => {
    const { titulo } = req.params;
    try {
        const publicacion = await Publicacion.findOne({ titulo });
        if (!publicacion) {
            return res
                .status(404)
                .json({ msg: 'Publicación no encontrada' });
        }
        res
            .status(200)
            .json(publicacion);

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al obtener la publicación' });
    }
}


const actualizarPublicacion = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, categoria } = req.body;

    try {
        // Validar campos vacíos
        if (!titulo || !descripcion || !categoria) {
            return res
                .status(400)
                .json({ msg: "Todos los campos son obligatorios" });
        }

        // Buscar la publicación
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res
                .status(404)
                .json({ msg: 'Publicación no encontrada' });
        }

        // Validar que el estudiante autenticado sea el autor
        if (!req.estudianteBDD || publicacion.autor.toString() !== req.estudianteBDD._id.toString()) {
            return res
                .status(403)
                .json({ msg: "No tienes permisos para editar esta publicación" });
        }

        // Actualizar la publicación
        publicacion.titulo = titulo;
        publicacion.descripcion = descripcion;
        publicacion.categoria = categoria
        await publicacion.save();

        res
            .status(200)
            .json({ 
                msg: "Publicación editada exitosamente",
                publicacion
            });

    } catch (error) {
        res
            .status(500)
            .json({ msg: "Error al actualizar la publicación" });
    }
}

const inactivarPublicacion = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ msg: 'ID no válido' });
    }

    try {
        const publicacionInactivada = await Publicacion.findByIdAndUpdate(id);
        if (!publicacionInactivada) {
            return res
                .status(404)
                .json({ msg: 'Publicación no encontrada' });
        }

        // Validar permisos: solo el autor o un administrador puede cambiar el estado
        const esAutor = req.estudianteBDD && publicacionInactivada.autor.toString() === req.estudianteBDD._id.toString();
        const esAdmin = req.AdministradorBDD && req.AdministradorBDD.rol === "administrador";
        if (!esAutor && !esAdmin) {
            return res
                .status(403)
                .json({ msg: "No tienes permisos para cambiar el estado de esta publicación" });
        }

        publicacionInactivada.estado = !publicacionInactivada.estado;
        await publicacionInactivada.save();

        const msg = publicacionInactivada.estado
            ? 'Publicación activada exitosamente'
            : 'Publicación inactivada exitosamente';

        res
            .status(200)
            .json({
                msg: msg
            });

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al inactivar la publicación' });
    }

}

const misPublicaciones = async (req, res) =>{
    try {
        // Si es administrador, puede consultar por query param o params
        if (req.AdministradorBDD && req.AdministradorBDD.rol === "administrador") {
            const { id } = req.params;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: "ID de usuario no válido" });
            }
            const publicaciones = await Publicacion.find({ autor: id })
                .populate('categoria')
                .sort({ createdAt: -1 });
            return res
                .status(200)
                .json(publicaciones);
        }

        // Si es estudiante, solo puede ver sus propias publicaciones
        const autor = req.estudianteBDD?._id;
        if (!autor) {
            return res.status(401).json({ msg: "No autorizado" });
        }
        const publicaciones = await Publicacion.find({ autor })
            .populate('categoria')
            .sort({ createdAt: -1 });
        res.status(200).json(publicaciones);

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener tus publicaciones" });
    }
}


const eliminarPublicacion = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID no válido' });
    }

    try {
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        // Solo el autor o un administrador puede eliminar la publicación
        const esAutor = req.estudianteBDD && publicacion.autor.toString() === req.estudianteBDD._id.toString();
        const esAdmin = req.AdministradorBDD && req.AdministradorBDD.rol === "administrador";
        if (!esAutor && !esAdmin) {
            return res.status(403).json({ msg: "No tienes permisos para eliminar esta publicación" });
        }

        await publicacion.deleteOne();

        res.status(200).json({ msg: "Publicación eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar la publicación" });
    }
};


const verPublicacionPorId = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ msg: 'ID no válido' });
    }

    try {
        const publicacion = await Publicacion.findById(id)
            .populate('autor')
            .populate('categoria');
        if (!publicacion) {
            return res
                .status(404)
                .json({ msg: 'Publicación no encontrada' });
        }
        res
            .status(200)
            .json(publicacion);

    } catch (error) {
        res
            .status(500)
            .json({ msg: "Error al obtener la publicación" });
    }
};


const publicacionVendida = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ msg: 'ID no válido' });
    }

    try {
        const publicacionVendida = await Publicacion.findByIdAndUpdate(id);
        if (!publicacionVendida) {
            return res
                .status(404)
                .json({ msg: 'Publicación no encontrada' });
        }

        // Validar permisos: solo el autor puede cambiar el estado
        const esAutor = req.estudianteBDD && publicacionVendida.autor.toString() === req.estudianteBDD._id.toString();
        if (!esAutor) {
            return res
                .status(403)
                .json({ msg: "No tienes permisos para cambiar el estado de esta publicación" });
        }

        publicacionVendida.disponible = !publicacionVendida.disponible;
        await publicacionVendida.save();

        const msg = publicacionVendida.disponible
            ? 'Publicación desmarcada como vendida exitosamente'
            : 'Publicación marcada como vendida exitosamente';

        res
            .status(200)
            .json({
                msg: msg
            });

    } catch (err) {
        res
            .status(400)
            .json({ error: 'Error al cambiar el estado de la publicación' });
    }
}


export {
    crearPublicacion,
    obtenerPublicaciones,
    verPublicacion,
    actualizarPublicacion,
    inactivarPublicacion,
    misPublicaciones,
    eliminarPublicacion,
    verPublicacionPorId,
    publicacionVendida,
}