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

exports.verify_permisson = function (req, res, next) {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '');

    let data_token = jwt.decode(token, 'estoesultrasecreto');
    //console.log(data_token);
    let profile_id = data_token.user.profile_id;

    models.Profile.findAll({
        where: {
            id: profile_id
        },
        include: [{
            model: models.Permission
        }]
    }).then(data => {
        console.log(data)
    })
    next();
}

exports.get_data_token = function (token) {
    let data_token = {};
    if (token) {
        token = token.replace('Bearer ', '');

        data_token = jwt.decode(token, 'estoesultrasecreto');
    }

    return data_token;
}