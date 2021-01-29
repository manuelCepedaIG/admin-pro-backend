require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./config');

// crear el servidor de express
const app = express();

// CORS
app.use( cors() );

// Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {
    res.status(201).json({
        ok: true,
        msg: 'Hola dato'
    });
});

app.listen(process.env.PORT, () => {
    console.log(`corriendo en puerto ${process.env.PORT}`);
});
