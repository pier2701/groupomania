// on importe mongoose
const mongoose = require("mongoose");

// on importe le module qui interprètera les erreurs en http, ainsi que les codes appropriés
const MongooseErrors = require("mongoose-errors");

// on rajoute un "plug-in" qui est "unique-validator"
const uniqueValidator = require("mongoose-unique-validator");

// on met en place la fonction qui contrôle le format de l'email
const { isEmail } = require('validator');

// on récupère la package "crypto-js" pour hâcher le "email"
//const cryptoJs = require("crypto-js");

// on récupère la package "bcrypt" pour hâcher le password
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxlength: 45,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            max: 400,
            minlength: 6
        },

        picture: {
            type: String,
            default: "../images/profil/random-user.jpg"
        },
        bio: {
            type: String,
            max: 1000,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
        timestamps: true, // enregistre le moment exact de l'action
    }
);

// on crypte avant de sauvegarder dans la "database"
userSchema.pre("save", async function (next) {
    // on chiffre le password 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();

});

// on décrypte le password avec bcrypt pour se "login"  
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email }); // on prend "email en référence de recherche"

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('mot de passe incorrect');
    }
    throw Error('email incorrect')
};

// on applique le plug-in au "schema"
userSchema.plugin(MongooseErrors);

// on applique le plug-in au "schema"
userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;