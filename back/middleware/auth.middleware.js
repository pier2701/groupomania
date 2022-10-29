const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

// on  récupère notre model "user"
const UserModel = require('../models/user');

// on met en place la logique pour vérifier notre "user"
exports.checkUser = (req, res, next) => {
    // on récupère le "token" via "cookie-parser"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, clearToken) => {
            if (error) {
                res.locals.user = null;
                next();
            } else {
                let user = await UserModel.findById(clearToken.id);
                // on  récupère l'Id' du "user"
                res.locals.user = user;
                console.log(user.pseudo)
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

// on met en place la logique de connection pour le front
exports.requireAuth = (req, res, next) => {
    // on récupère le "token" via "cookie-parser"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, clearToken) => {
            if (error) {
                console.log(error);
                res.send(200).json('Connection non-autorisée : ' + error)
            } else {
                console.log(clearToken.id);
                next();
            }
        });
    } else {
        console.log('Connection non-autorisée');
    }
};