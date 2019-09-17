var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Medico = require('../models/medico');

// =========================================
//  Obtener todos los medicos
// =========================================

app.get('/', function(req, res, next) {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var hasta = 5;
    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(hasta)
        .exec(
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }
                Medico.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Medicos caregados',
                        medicos: result,
                        actual: desde,
                        total: total
                    });
                });
            });
});

// =========================================
//  Crear un nuevo medico
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.id_usuario,
        hospital: body.id_hospital
    });
    medico.save((err, result) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Medico creado',
            Medico: result
        });
    });

});
// =========================================
//  Actualizar un medico
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    Medico.findById(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            });
        }
        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con el id ' + id }
            });
        }
        result.nombre = body.nombre;
        result.usuario = body.id_usuario;
        result.hospital = body.id_hospital;

        result.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado',
                medico: result
            });
        });
    });
});

// =========================================
//  Eliminar medico
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado',
        });
    });
});
module.exports = app;