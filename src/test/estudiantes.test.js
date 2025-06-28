
import { jest } from '@jest/globals';

import {
    login,
    registro,
    confirmEmail,
    recuperarPassword,
    nuevoPassword,
    cambiarPassword,
    actualizarDatosEstudiante,
    estudiantePerfil,
} from '../controllers/estudiante_controller.js';

// Mock mínimo para res Express
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('login - validaciones básicas', () => {
  it('retorna 400 si faltan campos', async () => {
    const req = { body: { email: '', password: '' } };
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, debes llenar todos los campos' });
  });
});

describe('registro - validaciones básicas', () => {
    it('retorna 400 si faltan campos', async () => {
        const req = { body: { email: '', password: '', celular: '', direccion: '', nombre: '', apellido: '' } };
        const res = mockRes();

        await registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, debes llenar todos los campos' });
    });

    it('retorna 400 si celular no tiene 10 dígitos', async () => {
        const req = { body: { email: 'a@a.com', password: 'Abc12345', celular: '123', direccion: 'dir', nombre: 'n', apellido: 'a' } };
        const res = mockRes();

        await registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'El número de celular debe tener 10 dígitos' });
    });

    it('retorna 400 si password < 8 caracteres', async () => {
        const req = { body: { email: 'a@a.com', password: 'Abc12', celular: '1234567890', direccion: 'dir', nombre: 'n', apellido: 'a' } };
        const res = mockRes();

        await registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe tener minimo 8 digitos' });
    });

    it('retorna 400 si password no contiene número', async () => {
        const req = { body: { email: 'a@a.com', password: 'Abcdefgh', celular: '1234567890', direccion: 'dir', nombre: 'n', apellido: 'a' } };
        const res = mockRes();

        await registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe contener al menos un número' });
    });

    it('retorna 400 si password no contiene mayúscula', async () => {
        const req = { body: { email: 'a@a.com', password: 'abc12345', celular: '1234567890', direccion: 'dir', nombre: 'n', apellido: 'a' } };
        const res = mockRes();

        await registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe contener al menos una mayúscula' });
    });
});

describe('confirmEmail - validaciones', () => {
    it('retorna 400 si no hay token', async () => {
        const req = { params: {} };
        const res = mockRes();

        await confirmEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, no se puede validar la cuenta' });
    });
});

describe('recuperarPassword - validaciones', () => {
    it('retorna 404 si falta email', async () => {
        const req = { body: { email: '' } };
        const res = mockRes();

        await recuperarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, debes llenar todos los campos' });
    });
});

describe('nuevoPassword - validaciones', () => {
    it('retorna 404 si falta algún campo', async () => {
        const req = { body: { password: '', confirmpassword: '' } };
        const res = mockRes();

        await nuevoPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, debes llenar todos los campos' });
    });

    it('retorna 400 si password < 6 caracteres', async () => {
        const req = { body: { password: '123', confirmpassword: '123' } };
        const res = mockRes();

        await nuevoPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    });

    it('retorna 400 si passwords no coinciden', async () => {
        const req = { body: { password: '123456', confirmpassword: '654321' } };
        const res = mockRes();

        await nuevoPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Lo sentimos, los passwords no coinciden' });
    });
});

describe('cambiarPassword - validaciones', () => {
    it('retorna 400 si faltan campos o son espacios', async () => {
        const req = { body: { passwordActual: '', nuevaPassword: ' ', repetirPassword: ' ' } };
        const res = mockRes();

        await cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });

    it('retorna 400 si nuevaPassword no tiene mayúscula', async () => {
        const req = { body: { passwordActual: '123', nuevaPassword: 'abc12345', repetirPassword: 'abc12345' } };
        const res = mockRes();

        await cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe tener al menos una letra mayúscula' });
    });

    it('retorna 400 si nuevaPassword no tiene número', async () => {
        const req = { body: { passwordActual: '123', nuevaPassword: 'Abcdefgh', repetirPassword: 'Abcdefgh' } };
        const res = mockRes();

        await cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La contraseña debe contener al menos un número' });
    });

    it('retorna 400 si nuevaPassword < 8 caracteres', async () => {
        const req = { body: { passwordActual: '123', nuevaPassword: 'Abc12', repetirPassword: 'Abc12' } };
        const res = mockRes();

        await cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'La nueva contraseña debe tener al menos 8 caracteres' });
    });

    it('retorna 400 si nuevaPassword y repetirPassword no coinciden', async () => {
        const req = { body: { passwordActual: '123', nuevaPassword: 'Abc12345', repetirPassword: 'Xyz12345' } };
        const res = mockRes();

        await cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Las nuevas contraseñas no coinciden' });
    });
});

describe('actualizarDatosEstudiante - validaciones', () => {
    it('retorna 400 si faltan campos o son espacios', async () => {
        const req = { body: { nombre: '', apellido: '', celular: '', direccion: '' } };
        const res = mockRes();

        await actualizarDatosEstudiante(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
    });

    it('retorna 400 si celular no tiene 10 dígitos', async () => {
        const req = { body: { nombre: 'n', apellido: 'a', celular: '123', direccion: 'dir' } };
        const res = mockRes();

        await actualizarDatosEstudiante(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'El número de celular debe tener 10 dígitos' });
    });
});

describe('estudiantePerfil - validaciones', () => {
    it('retorna 401 si no está autenticado', async () => {
        const req = {};
        const res = mockRes();

        await estudiantePerfil(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'No autorizado' });
    });
});

