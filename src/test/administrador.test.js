import { jest } from '@jest/globals';

import {
    loginAdministrador,
    actualizarPassword,
    actualizarDatosAdministrador,
    administradorPerfil,
} from '../controllers/administrador_controller.js';

// Mock mínimo para res Express
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('loginAdministrador', () => {
    it('retorna 400 si faltan campos', async () => {
        const req = { body: { email: '', password: '' } };
        const res = mockRes();

        await loginAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, debes llenar todos los campos" });
    });

    it('retorna 404 si admin no existe', async () => {
        const req = { body: { email: 'noexiste@mail.com', password: 'Pass1234' } };
        const res = mockRes();

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findOne').mockResolvedValue(null);

        await loginAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

        Administrador.default.findOne.mockRestore();
    });

    it('retorna 403 si rol no es administrador', async () => {
        const req = { body: { email: 'admin@mail.com', password: 'Pass1234' } };
        const res = mockRes();

        const mockAdmin = {
        rol: 'usuario',
        };
        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findOne').mockResolvedValue(mockAdmin);

        await loginAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado: no tienes permisos de administrador" });

        Administrador.default.findOne.mockRestore();
    });

    it('retorna 404 si password incorrecto', async () => {
        const req = { body: { email: 'admin@mail.com', password: 'wrongPass' } };
        const res = mockRes();

        const mockAdmin = {
        rol: 'administrador',
        matchPassword: jest.fn().mockResolvedValue(false),
        };

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findOne').mockResolvedValue(mockAdmin);

        await loginAdministrador(req, res);

        expect(mockAdmin.matchPassword).toHaveBeenCalledWith('wrongPass');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el password no es el correcto" });

        Administrador.default.findOne.mockRestore();
    });

});

describe('actualizarPassword', () => {
    it('retorna 400 si faltan campos o están vacíos', async () => {
        const req = { body: { passwordActual: '', nuevaPassword: '', repetirPassword: '' } };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Todos los campos son obligatorios" });
    });

    it('retorna 400 si nuevaPassword no tiene mayúscula', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'password1', repetirPassword: 'password1' } };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "La contraseña debe tener al menos una letra mayúscula" });
    });

    it('retorna 400 si nuevaPassword no tiene número', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'Password', repetirPassword: 'Password' } };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "La contraseña debe contener al menos un número" });
    });

    it('retorna 400 si nuevaPassword menor a 8 caracteres', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'Pass1', repetirPassword: 'Pass1' } };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "La nueva contraseña debe tener al menos 8 caracteres" });
    });

    it('retorna 400 si nuevaPassword y repetirPassword no coinciden', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'Password1', repetirPassword: 'Password2' } };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Las nuevas contraseñas no coinciden" });
    });

    it('retorna 401 si no hay administrador autenticado', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'Password1', repetirPassword: 'Password1' }, AdministradorBDD: null };
        const res = mockRes();

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado" });
    });

    it('retorna 404 si admin no encontrado en BD', async () => {
        const req = { body: { passwordActual: 'Pass1234', nuevaPassword: 'Password1', repetirPassword: 'Password1' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(null);

        await actualizarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Administrador no encontrado" });

        Administrador.default.findById.mockRestore();
    });

    it('retorna 400 si contraseña actual incorrecta', async () => {
        const req = { body: { passwordActual: 'WrongPass1', nuevaPassword: 'Password1', repetirPassword: 'Password1' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        const mockAdmin = {
        matchPassword: jest.fn().mockResolvedValue(false),
        };
        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(mockAdmin);

        await actualizarPassword(req, res);

        expect(mockAdmin.matchPassword).toHaveBeenCalledWith('WrongPass1');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "La contraseña actual es incorrecta" });

        Administrador.default.findById.mockRestore();
    });

    it('retorna 200 si contraseña actualizada correctamente', async () => {
        const req = { body: { passwordActual: 'CorrectPass1', nuevaPassword: 'NewPass1A', repetirPassword: 'NewPass1A' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        const mockAdmin = {
        matchPassword: jest.fn().mockResolvedValue(true),
        encrypPassword: jest.fn().mockResolvedValue('hashedpass'),
        save: jest.fn().mockResolvedValue(true),
        };
        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(mockAdmin);

        await actualizarPassword(req, res);

        expect(mockAdmin.matchPassword).toHaveBeenCalledWith('CorrectPass1');
        expect(mockAdmin.encrypPassword).toHaveBeenCalledWith('NewPass1A');
        expect(mockAdmin.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "Contraseña actualizada exitosamente" });

        Administrador.default.findById.mockRestore();
    });
});

describe('actualizarDatosAdministrador', () => {
    it('retorna 400 si faltan campos o están vacíos', async () => {
        const req = { body: { nombre: '', apellido: '', celular: '', direccion: '' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        await actualizarDatosAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Todos los campos son obligatorios" });
    });

    it('retorna 400 si celular no tiene 10 dígitos', async () => {
        const req = { body: { nombre: 'Nombre', apellido: 'Apellido', celular: '12345', direccion: 'Dir' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        await actualizarDatosAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "El número de celular debe tener 10 dígitos" });
    });

    it('retorna 401 si no hay admin autenticado', async () => {
        const req = { body: { nombre: 'Nombre', apellido: 'Apellido', celular: '1234567890', direccion: 'Dir' }, AdministradorBDD: null };
        const res = mockRes();

        await actualizarDatosAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado" });
    });

    it('retorna 404 si admin no encontrado', async () => {
        const req = { body: { nombre: 'Nombre', apellido: 'Apellido', celular: '1234567890', direccion: 'Dir' }, AdministradorBDD: { _id: 'adminid' } };
        const res = mockRes();

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(null);

        await actualizarDatosAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Administrador no encontrado" });

        Administrador.default.findById.mockRestore();
    });

    it('retorna 200 si datos iguales sin cambios', async () => {
        const req = { 
        body: { nombre: 'Nombre', apellido: 'Apellido', celular: '1234567890', direccion: 'Dir' }, 
        AdministradorBDD: { _id: 'adminid' } 
        };
        const res = mockRes();

        const mockAdmin = {
        nombre: 'Nombre',
        apellido: 'Apellido',
        celular: '1234567890',
        direccion: 'Dir',
        save: jest.fn(),
        };

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(mockAdmin);

        await actualizarDatosAdministrador(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "No se realizaron cambios, los datos son los mismos." });

        Administrador.default.findById.mockRestore();
    });

    it('retorna 200 si datos actualizados', async () => {
        const req = { 
        body: { nombre: 'Nuevo', apellido: 'Nuevo', celular: '0987654321', direccion: 'Nueva Dir' }, 
        AdministradorBDD: { _id: 'adminid' } 
        };
        const res = mockRes();

        const mockAdmin = {
        nombre: 'Nombre',
        apellido: 'Apellido',
        celular: '1234567890',
        direccion: 'Dir',
        save: jest.fn().mockResolvedValue(true),
        };

        const Administrador = await import('../models/administrador.js');
        jest.spyOn(Administrador.default, 'findById').mockResolvedValue(mockAdmin);

        await actualizarDatosAdministrador(req, res);

        expect(mockAdmin.nombre).toBe('Nuevo');
        expect(mockAdmin.apellido).toBe('Nuevo');
        expect(mockAdmin.celular).toBe('0987654321');
        expect(mockAdmin.direccion).toBe('Nueva Dir');

        expect(mockAdmin.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "Datos actualizados exitosamente" });

        Administrador.default.findById.mockRestore();
    });
});

describe('administradorPerfil', () => {
    it('retorna 401 si no autorizado', async () => {
        const req = { AdministradorBDD: null };
        const res = mockRes();

        await administradorPerfil(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado" });
    });

    it('retorna 200 con datos sin password', async () => {
        const req = { AdministradorBDD: { _id: 'adminid', nombre: 'Nombre', password: 'secret' } };
        const res = mockRes();

        await administradorPerfil(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        // El password debe estar excluido
        expect(res.json).toHaveBeenCalledWith({ _id: 'adminid', nombre: 'Nombre' });
    });
});