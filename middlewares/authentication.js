const jose = require('jose')

const jwksClient = jose.createRemoteJWKSet(new URL('http://localhost:9011/.well-known/jwks.json'));

const authentication = async (req, res, next) => {
    const access_token = req.cookies['app.at'];

    if (!access_token) {
        res.status(401);
        res.send({error: 'Missing token cookie and Authorization header'});
    } else {
        try {
            await jose.jwtVerify(access_token, jwksClient, {
                issuer: 'http://localhost:9011',
                audience: 'e9fdb985-9173-4e01-9d73-ac2d60d1dc8e',
            });
            next();
        } catch (e) {
            if (e instanceof jose.errors.JOSEError) {
                res.status(401);
                res.send({error: e.message, code: e.code});
            } else {
                res.status(500);
                res.send({error: JSON.stringify(e)});
            }
        }
    }
}

module.exports = authentication;
