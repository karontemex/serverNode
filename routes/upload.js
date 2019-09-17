var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

// default options
app.use(fileUpload());

//modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.get('/', function(req, res, next) {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente - upload'
    });
});

app.put('/:tipo/:id', function(req, res, next) {
    // console.log(req.files.imagen); // the uploaded file object
    var tipo = req.params.tipo;
    var id = req.params.id;
    var tipos = ['usuarios', 'medicos', 'hospitales'];
    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección no valida',
            errors: { message: 'Los tipo validos de colección son ' + tipos.join(' ') }
        });
    }
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    /* obtener nombre del archivo */
    var archivo = req.files.imagen;
    var nombre = archivo.name.split('.');
    var extension = nombre[nombre.length - 1];

    // Permitidos
    var extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Archivo no válido',
            errors: { message: 'Laa entenciones válidas son ' + extensionesValidas.join(' ') }
        });
    }

    //Nombre aleatorio 
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extension}`;

    path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover el archivo ',
                errors: { message: err }
            });
        }


        // actualizar registro 
        subirPorTipo(tipo, id, nombreArchivo, res);

        // return res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo Cargado correctamente',
        //     archivo: req.files.imagen,
        //     path: path
        // });
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al mover el archivo ',
                    errors: { message: err }
                });
            }
            var pathViejo = './uploads/usuarios/' + result.img;
            if (result.img != "" && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) throw err;
                });
            }

            result.img = nombreArchivo;

            result.save((err, actualizacion) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario con el archivo ',
                        errors: { message: err }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    usuario: actualizacion
                });
            });
        });

    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al mover el archivo ',
                    errors: { message: err }
                });
            }
            var pathViejo = './uploads/hospitales/' + result.img;
            if (result.img != "" && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) throw err;
                });
            }

            result.img = nombreArchivo;

            result.save((err, actualizacion) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el hospital con el archivo ',
                        errors: { message: err }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    usuario: actualizacion
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, result) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al mover el archivo ',
                    errors: { message: err }
                });
            }
            var pathViejo = './uploads/usuarios/' + result.img;
            if (result.img != "" && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) throw err;
                });
            }

            result.img = nombreArchivo;

            result.save((err, actualizacion) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el medico con el archivo ',
                        errors: { message: err }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Actualizada',
                    usuario: actualizacion
                });
            });
        });
    }
}
module.exports = app;