const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

// on déclare la variable d'environnement de connection
const MONGODB_URI = process.env.MONGODB_URI;

// on se connecte à la "database"
mongoose
    .connect(
        MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("Connexion à MongoDB Atlas réussie !"))
    .catch((error) => console.log("Connexion à MongoDB échouée !", error));