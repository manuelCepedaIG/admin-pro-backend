require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const path = require('path');

// crear el servidor de express
const app = express();

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`corriendo en puerto ${process.env.PORT}`);
});
