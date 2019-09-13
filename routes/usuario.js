var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Usuario = require('../models/usuario');

// =========================================
//  Obtener todos los usuarios
// =========================================

app.get('/', function(req, res, next) {
    Usuario.find({}, 'nombre email img role').exec(
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Usuarios caregados',
                usuarios: result
            });
        }
    );
});

// =========================================
//  Verificar Token
// =========================================
// var SEED = require('../config/config').SEED;
// app.use('/', (req, res, next) => {
//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Token no válido',
//                 errors: err
//             });
//         }
//     });
//     next();
// });

// =========================================
//  Crear un nuevo usuario
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, result) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado',
            usuarios: result
        });
    });

});
// =========================================
//  Actualizar un nuevo usuario
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }
        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el id ' + id }
            });
        }
        result.nombre = body.nombre;
        result.email = body.email;
        result.role = body.role;

        result.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            result.password = ':´(';
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado',
                usuarios: result
            });
        });
    });
});

// =========================================
//  Eliminar usuario
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado',
        });
    });
});
module.exports = app;