var express = require('express');
const path = require('path');
const fs = require('fs');
var app = express();

app.get('/:tipo/:img', function(req, res, next) {
    var img = req.params.tipo;
    var tipo = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    var pathNoImagen = path.resolve(__dirname, `../assets/noimage.jpg`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;