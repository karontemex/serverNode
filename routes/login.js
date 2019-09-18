var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
// =========================================
//  Logon con google
// =========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    console.log(payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post("/google", async(req, res) => {
    var gToken = req.body.token;
    var googleUser = await verify(gToken)
        .catch(e => {
            console.error(e);
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido',
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error usuario no encontrado',
                errors: err
            });
        }
        if (result) {
            if (result.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario debe usar su autenticacion normal',
                    errors: err
                });
            } else {
                var token = jwt.sign({ usuario: result }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    mensaje: 'Usuarios cargados',
                    id: result._id,
                    usuario: result,
                    token: token
                });
            }
        } else {
            //usuario no existe y se crea
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.password = ':)';
            usuario.img = googleUser.img
            usuario.google = true;

            usuario.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuario no válido - google',
                        errors: err
                    });
                }
                var token = jwt.sign({ usuario: result }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    mensaje: 'Usuarios registrado google',
                    id: result._id,
                    usuario: result,
                    token: token
                });
            });
        }
    });
    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Usuarios válidado',
    //     usuario: googleUser,
    // });

});

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
            mensaje: 'Usuarios cargados',
            id: result._id,
            usuario: result,
            token: token
        });
    });
});

module.exports = app;