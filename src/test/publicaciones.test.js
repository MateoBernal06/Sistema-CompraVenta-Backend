import { jest } from '@jest/globals';

import {
    crearPublicacion,
    actualizarPublicacion,
    inactivarPublicacion,
    eliminarPublicacion,
    verPublicacionPorId,
    publicacionVendida,
    obtenerPublicaciones
} from '../controllers/publicacion_controller.js';


// Mock mínimo para res Express
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};



describe('crearPublicacion - validaciones', () => {
    it('debe retornar 400 si faltan campos obligatorios', async () => {
        const req = { body: {}, estudianteBDD: { _id: 'id' }, file: { path: 'img.jpg' } };
        const res = mockRes();

        await crearPublicacion(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });

    it('debe retornar 401 si no hay autor', async () => {
        const req = { body: { titulo: 't', descripcion: 'd', categoria: '123', precio: '10' }, file: { path: 'img.jpg' } };
        const res = mockRes();

        req.estudianteBDD = undefined;

        await crearPublicacion(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'No autorizado' });
    });
});

describe('actualizarPublicacion - validaciones', () => {
    it('debe retornar 400 si faltan campos', async () => {
        const req = { params: { id: '1' }, body: {}, estudianteBDD: { _id: 'id' } };
        const res = mockRes();

        await actualizarPublicacion(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });
});

describe('inactivarPublicacion - validaciones', () => {
    it('debe retornar 400 si id no es válido', async () => {
        const req = { params: { id: 'no-valido' } };
        const res = mockRes();

        await inactivarPublicacion(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID no válido' });
    });
});

describe('eliminarPublicacion - validaciones', () => {
    it('debe retornar 400 si id no es válido', async () => {
        const req = { params: { id: 'no-valido' } };
        const res = mockRes();

        await eliminarPublicacion(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID no válido' });
    });
});

describe('verPublicacionPorId - validaciones', () => {
    it('debe retornar 400 si id no es válido', async () => {
        const req = { params: { id: 'no-valido' } };
        const res = mockRes();

        await verPublicacionPorId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID no válido' });
    });
});

describe('publicacionVendida - validaciones', () => {
    it('debe retornar 400 si id no es válido', async () => {
        const req = { params: { id: 'no-valido' } };
        const res = mockRes();

        await publicacionVendida(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID no válido' });
    });
});

