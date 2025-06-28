import mongoose from 'mongoose';
import { jest } from '@jest/globals';

import {
    crearPublicacion,
    actualizarPublicacion,
    inactivarPublicacion,
    eliminarPublicacion,
    verPublicacionPorId,
    publicacionVendida,
} from '../controllers/publicacion_controller.js';

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

import {
    crearCategoria,
    verTodasCategorias,
    verCategoria,
    actualizarCategoria,
    inactivarCategoria,
} from '../controllers/categoria_controller.js';

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

//! Pruebas de los controladores de publicaciones

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


//! Pruebas de los controladores de estudiantes
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


//! Pruebas de los controladores de categorías

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

//! Pruebas de los controladores de administradores

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