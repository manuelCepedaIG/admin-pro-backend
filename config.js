const mongoose = require('mongoose');

const dbConnection = async() => {

    try 
    {
        await mongoose.connect(process.env.CONN, 
            {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
        console.log('DB Online, conexión OK');
    }
    catch(error)
    {
        console.log(error);
        throw new Error('Error a en conexion a db');
    }
}

module.exports = {
    dbConnection
}