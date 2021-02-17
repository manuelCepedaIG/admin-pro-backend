const jwt = require('jsonwebtoken')

const generarJWT = ( uid, role, email ) => {
    
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            role,
            email
        };
        
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h',
        }, (err, token) => {
            if( err ) {
                console.log(err);
                reject('No se pudo generar el token JWT');
            }
            else {
                resolve(token);
            }
        }  );
        
    });
};

module.exports = {
    generarJWT,
}