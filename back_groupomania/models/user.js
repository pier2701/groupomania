// on importe mongoose
const mongoose = require("mongoose");

// on rajoute un "plug-in" qui est "unique-validator"
const uniqueValidator = require("mongoose-unique-validator");

// on met en place la fonction qui contrôle le format de l'email
const { isEmail } = require('validator');

// on met en place la création d'un "password" fort
const { isValidPassword } = require('mongoose-custom-validators')

// on récupère la package "bcrypt" pour hâcher le password
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: [true, 'Veuillez saisir un pseudo'],
            unique: true,
            minLength: 4,
            maxLength: 35,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Veuillez saisir un email'],
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
            validate: [isEmail],
        },
        password: {
            type: String,
            required: [true, 'Veuillez saisir un password'],
            max: 1024,
            minLength: 8,
            required: true,
            validate: [isValidPassword],
        },

        picture: {
            type: String,
            default: "./uploads/profil/random-user.png",
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
        // on utilisera le mot "password" pour l'exploiter en front
        throw Error('password incorrect');
    }
    // on utilisera le mot "email" pour l'exploiter en front
    throw Error('email incorrect')
};

// on applique le plug-in au "schema"
userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;