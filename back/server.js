const express = require('express');
const cookieParser = require('cookie-parser');

// on importe les routes "user"
const userRoutes = require('./routes/user.routes');

// on importe les routes "post"
const postRoutes = require('./routes/post.routes');

require('dotenv').config({ path: './config/.env' });
require('./config/database');

// on importe le module "path" pour interagir avec les routes de fichiers "image"
const path = require("path");

// on importe le module "express-mongo-sanitize" pour prévenir des des attaques par injection de code dans les "form"
const mongoSanitize = require("express-mongo-sanitize");

// on appelle le middleware de vérification "user"
const { checkUser, requireAuth } = require('./middleware/auth.middleware')

const app = express();

// on imorte le module "morgan" pour le suivi des requêtes
const morgan = require("morgan");

// installation du module "helmet" qui prévient des failles de sécurité courante liées au "headers"
const helmet = require("helmet");

//on importe un module contre attaque de type "brute-force" et "dictionary"
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requêtes par IP durant 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
});

// on importe le module CORS pour Cross-Origin Resource Sharing ou Partage des Ressources entre Origines Multiples
const cors = require("cors");
const options = {
    // on détermine la source qui est autorisé à faire des requêtes
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(options));
// middleware qui intercepte les requêtes utilisateur POUR LES RENDRE EXPLOITABLE sous format "json"
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// mise en place d'une route pour les fichiers "static" (images)
app.use("/posts", express.static(path.join(__dirname, "uploads")));

// on met en place le module qui nous pernet de lire les "cookies" 
app.use(cookieParser());

app.use(helmet());
// on désactive le header "X-Powered-By" qui pourrait constituer une fuite d'informations
app.use(helmet.hidePoweredBy());

// configuration "Cross-Origin-Resource-Policy: same-site"
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

//configuration "express-mongo-sanitze" allowDots et replaceWith en globale
app.use(
    mongoSanitize({
        allowDots: true,
        replaceWith: "_",
    })
);

// on met en place la vérification "user" ("jwt") avant toutes nos routes
app.get('*', checkUser);

// route "front" pour vérifier le "user"
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// nos routes "user"
app.use('/api/user', userRoutes, apiLimiter);

// mise en place des chemins "post" vers "api/post" 
app.use('/api/post', postRoutes);
// on configure le port de notre serveur
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});