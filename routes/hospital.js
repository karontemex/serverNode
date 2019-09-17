var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Hospital = require('../models/hospital');

// =========================================
//  Obtener todos los hospital
// =========================================

app.get('/', function(req, res, next) {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var hasta = 5;

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(hasta)
        .exec(
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Hospital.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Hospitales caregados',
                        hospitales: result,
                        actual: desde,
                        total: total
                    });
                });
            });
});

// =========================================
//  Crear un nuevo hospital
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.id_usuario
    });
    hospital.save((err, result) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Hospital creado',
            hospital: result
        });
    });

});
// =========================================
//  Actualizar un hospital
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    Hospital.findById(id, (err, result) => {
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
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con el id ' + id }
            });
        }
        result.nombre = body.nombre;
        result.usuario = body.id_usuario;

        result.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Hospital actualizado',
                hospital: result
            });
        });
    });
});

// =========================================
//  Eliminar hospital
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Hospital eliminado',
        });
    });
});
module.exports = app;