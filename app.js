//Requires
var express = require('express');
var mongoose = require('mongoose');
// Creacion del server
var app = express();

//DB conection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('DB server:\x1b[32m%s\x1b[0m', ' on-line!');
});
//Rutas
app.get('/', function(req, res, next) {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

//Inicio de server
app.listen(3000, function() {
    console.log('Express server en puerto 3000:\x1b[32m%s\x1b[0m', ' on-line!');
});