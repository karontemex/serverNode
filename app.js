//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Iniciacion de variables
var app = express();

//bodyParser
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// app.use(bodyParser.json())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//importacion rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//DB conection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('DB server:\x1b[32m%s\x1b[0m', ' on-line!');
});

//Rutas
app.use('/', appRoutes);

//usuario
app.use('/usuario', usuarioRoutes);
//Login
app.use('/login', loginRoutes);


//Inicio de server
app.listen(3000, function() {
    console.log('Express server en puerto 3000:\x1b[32m%s\x1b[0m', ' on-line!');
});