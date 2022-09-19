const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

// on  récupère notre model "user"
const UserModel = require('../models/user');

// on met en place la logique pour vérifier notre "user"
module.exports.checkUser = (req, res, next) => {
    // on récupère le "token" via "cookie-parser"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, clearToken) => {
            if (error) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(clearToken.id);
                // on  récupère les infos du "user"
                res.locals.user = user;
                console.log(res.locals.user);
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

// on met en place la logique de connection pour le front
module.exports.requireAuth = (req, res, next) => {
    // on récupère le "token" via "cookie-parser"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, clearToken) => {
            if (error) {
                console.log(error);
                res.send(200).json('Connection non-autorisée')
            } else {
                console.log("l'iD du 'user' : " + clearToken.id);
                next();
            }
        });
    } else {
        console.log('Connection non-autorisée');
    }
};