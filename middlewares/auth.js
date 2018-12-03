var jwt = require('jsonwebtoken');
var models = require('../models');

exports.validate = function (req, res, next) {
    var token = req.headers['authorization']
    if (!token) {
        res.status(401).json({
            status: false,
            msg: "Es necesario el token de autenticación"
        });
        return;
    }

    token = token.replace('Bearer ', '');

    jwt.verify(token, 'estoesultrasecreto', function (err, user) {
        if (err) {
            res.status(401).json({
                status: false,
                msg: 'Token inválido'
            });
        }
    })

    next();
}

exports.verify_permisson = function (req, res, next) {
    var token = req.headers['authorization'];
    token = token.replace('Bearer ', '');

    let current_url = req.originalUrl;
    let data_token = jwt.decode(token, 'estoesultrasecreto');
    let profile_id = data_token.user.profile_id;

    models.Profile.findOne({
        attributes: [],
        where: {
            id: profile_id
        },
        include: [{
            attributes: ['name'],
            model: models.Permission
        }]
    }).then(data => {
        let permissions = data.Permissions;
        let status_permission = false;

        permissions.map(permission => {
            let permission_profile = permission.name;
            if (current_url.search(permission_profile.toLowerCase()) != -1) {
                status_permission = true;
            }
        });

        if (!status_permission) {
            res.status(401).json({
                status: false,
                msg: 'Sin permisos para la acción'
            });
        }

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