const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

// on exporte la méthode du jwt
module.exports = (req, res, next) => {
    // on gère la réponse ( promise ) avec un try/catch
    try {
        // on récupère que le token et on isole l'id avec la méthode "split" qui divisera notre [] au niveau de ' ' ( l'espace )
        const token = req.headers.authorization.split(" ")[1]; // [1] correspond à la 2ème partie qu'on voudra récupèrer
        console.log(req.headers.authorization);
        // on décode le token récupéré avec la méthode "verify" de jwt
        const payLoad = jwt.verify(token, process.env.SECRET_KEY); // token récupéré + "RANDOM_TOKEN_SALT"
        console.log(payLoad);
        // on récupère notre token décodé dans une constante
        const userId = payLoad.userId;

        // on rajoute cette valeur à l'objet "req" qui accompagnera toutes les routes
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Vous n'êtes pas authentifié" });
    }
};