var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

// =========================================
//  Login usuario
// =========================================

app.post('/', function(req, res, next) {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error usuario no encontrado',
                errors: err
            });
        }
        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales no válidas - email',
            });
        }

        if (!bcrypt.compareSync(body.password, result.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales no válidas - pwd',
            });
        }

        //Crear token 14400: cuatro horas
        result.password = ":)";
        var token = jwt.sign({ usuario: result }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            mensaje: 'Usuarios caregados',
            id: result._id,
            usuario: result,
            token: token
        });
    });
});

module.exports = app;