var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.get('/todo/:busqueda', function(req, res, next) {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), buscarMedico(busqueda, regex), buscarUsuario(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
    // Hospital.find({ nombre: regex1 }, (err, result) => {
    //     res.status(200).json({
    //         ok: true,
    //         mensaje: 'Petición realizada correctamente',
    //         hospitales: result
    //     });
    // });

});
// =========================================
//  Busquedas por coleccion
// =========================================
app.get('/coleccion/:tabla/:busqueda', function(req, res) {
    var busqueda = req.params.busqueda;
    var coleccion = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (coleccion) {
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medico':
            promesa = buscarMedico(busqueda, regex);

            break;
        case 'usuario':
            promesa = buscarUsuario(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'No se puede realizar la peticion correctamente',

            });
            break;
    }
    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
            [coleccion]: respuesta
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('medico', 'nombre')
            .exec((err, result) => {
                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(result);
                }
            });

    });

};

function buscarMedico(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, result) => {
                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(result);
                }
            });

    });
};

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, result) => {
                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(result);
                }
            });

    });
}

module.exports = app;