const UserModel = require('../models/user');
// on récupère le module via une variable
const jwt = require('jsonwebtoken');

// on récupère la gestion des "errors"
const { signUpErrors, signInErrors } = require('../utils/errors');

const maxAge = 3 * 24 * 60 * 60 * 1000;
require('dotenv').config({ path: './config/.env' });

// paramètre du "token"
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: maxAge
    })
};

// la logique pour s'inscrire
exports.signUp = async (req, res) => {
    const { pseudo, email, password } = req.body;

    try {
        const user = await UserModel.create({ pseudo, email, password });
        res.status(201).send({ user: user._id });
    }
    catch (error) {
        console.log("le catch error du signup : " + error);
        // on récupère les errors pour les renvoyer au "front"

        const errors = signUpErrors(error);
        res.status(200).send({ errors })
    }
}

// la logique pour se connecter
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        // on met le "token" dans un cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(200).json({ user: user._id })
    } catch (error) {
        console.log(error);
        // on récupère les errors pour les renvoyer au "front"
        const errors = signInErrors(error);
        res.status(200).send({ errors });
    }
}

// la logique pour se déconnecter
exports.logout = (req, res) => {
    // on génère un cookie vide
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}