import mongoose from 'mongoose';
import { jest } from '@jest/globals';

import {
    crearCategoria,
    verTodasCategorias,
    verCategoria,
    actualizarCategoria,
    inactivarCategoria,
} from '../controllers/categoria_controller.js';

// Mock mínimo para res Express
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('crearCategoria - validaciones', () => {
    it('retorna 400 si falta nombre o descripcion', async () => {
        const req = { body: { nombre: '', descripcion: '' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        await crearCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });

    it('retorna 400 si nombre ya existe', async () => {
        const req = { body: { nombre: 'cat', descripcion: 'desc' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        // Mock Categoria.findOne para simular nombre repetido
        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findOne').mockResolvedValue({ nombre: 'cat' });

        await crearCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'El nombre de la categoría ya existe' });

        Categoria.default.findOne.mockRestore();
    });
});

describe('verTodasCategorias', () => {
    it('retorna 200 con lista de categorias', async () => {
        const req = {};
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'find').mockResolvedValue([{ nombre: 'cat1' }, { nombre: 'cat2' }]);

        await verTodasCategorias(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ nombre: 'cat1' }, { nombre: 'cat2' }]);

        Categoria.default.find.mockRestore();
    });

    it('retorna 400 si hay error', async () => {
        const req = {};
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'find').mockRejectedValue(new Error('DB error'));

        await verTodasCategorias(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener las categorías' });

        Categoria.default.find.mockRestore();
    });
});

describe('verCategoria', () => {
    it('retorna 404 si no existe categoria', async () => {
        const req = { params: { nombre: 'noexiste' } };
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findOne').mockResolvedValue(null);

        await verCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Categoría no encontrada' });

        Categoria.default.findOne.mockRestore();
    });

    it('retorna 200 si existe categoria', async () => {
        const req = { params: { nombre: 'existe' } };
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findOne').mockResolvedValue({ nombre: 'existe', descripcion: 'desc' });

        await verCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ nombre: 'existe', descripcion: 'desc' });

        Categoria.default.findOne.mockRestore();
    });
});

describe('actualizarCategoria', () => {
    it('retorna 400 si campos vacios', async () => {
        const req = { params: { id: '123' }, body: { nombre: '', descripcion: '' } };
        const res = mockRes();

        await actualizarCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });

    it('retorna 400 si nombre ya existe para otro id', async () => {
        const req = { params: { id: 'id123' }, body: { nombre: 'cat', descripcion: 'desc' } };
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findOne').mockResolvedValue({ nombre: 'cat' });

        await actualizarCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'El nombre de la categoría ya existe' });

        Categoria.default.findOne.mockRestore();
    });

    it('retorna 404 si categoria no encontrada para actualizar', async () => {
        const req = { params: { id: 'id123' }, body: { nombre: 'nuevo', descripcion: 'desc' } };
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findOne').mockResolvedValue(null);
        jest.spyOn(Categoria.default, 'findByIdAndUpdate').mockResolvedValue(null);

        await actualizarCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Categoría no encontrada' });

        Categoria.default.findOne.mockRestore();
        Categoria.default.findByIdAndUpdate.mockRestore();
    });
});

describe('inactivarCategoria', () => {
    it('retorna 400 si id no valido', async () => {
        const req = { params: { id: '123' } };
        const res = mockRes();

        await inactivarCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID no válido' });
    });

    it('retorna 404 si categoria no encontrada', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = mockRes();

        const Categoria = await import('../models/categoria.js');
        jest.spyOn(Categoria.default, 'findByIdAndUpdate').mockResolvedValue(null);

        await inactivarCategoria(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Categoría no encontrada' });

        Categoria.default.findByIdAndUpdate.mockRestore();
    });
});