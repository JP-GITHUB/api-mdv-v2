var jwt = require('jsonwebtoken');
var models = require('../models');

exports.validate = function (req, res, next) {
    var token = req.headers['authorization']
    if (!token) {
        res.status(401).json({
            error: "Es necesario el token de autenticación"
        });
        return;
    }

    token = token.replace('Bearer ', '');

    jwt.verify(token, 'estoesultrasecreto', function (err, user) {
        if (err) {
            res.status(401).json({
                error: 'Token inválido'
            });
        }
    })

    next();
}

exports.veryfy_permisson = function (req, res, next) {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '');

    let data_token =jwt.decode(token, 'estoesultrasecreto');
    let perfil_id = data_token.user.PERFIL.id;

    models.PERFIL.findAll({
        where: {
            id: perfil_id
        }
    }).then(data => {
        console.log(data)
    })
    next();
}