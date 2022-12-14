// on importe notre model "user"
const User = require("../models/user");

// le module "fs" nous permettra de manipuler des fichiers
const fs = require("fs");

const sharp = require("sharp");

// on importe une fonction qui exploitera les "error" pour le front
const { uploadErrors } = require("../utils/errors");

exports.uploadProfileImage = async (req, res) => {
    try {
        if (
            // on vérifie le "bon" format de l'image
            req.file.mimetype != "image/jpg" &&
            req.file.mimetype != "image/png" &&
            req.file.mimetype != "image/jpeg"
        )
            throw Error("invalid file");
        if (
            // on limite la taille de l'image
            req.file.size > 500000
        )
            throw Error("max size")
    } catch (error) {
        // on récupère les erreurs pour les afficher dans le front
        const errors = uploadErrors(error);
        return res.status(201).json({ errors });
    }

    // on renomme notre image avec le même nom en jpg
    // en cas de màj la nouvelle image écrasera l'ancienne
    const fileName = req.body.name + ".jpg";

    // on récupère le fichier qu'on importera dans "../uploads/profil/"
    await sharp(req.file.buffer)
        .toFile(`${__dirname}/../../front/public/uploads/profil/${fileName}`)

    try {
        // on met à jour l'image du "user"
        User.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: "./uploads/profil/" + fileName } }, // le nom du nouveau fichier à jour
            { new: true, upsert: true, setDefaultsOnInsert: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send("erreur dans 'picture' du 'user' : " + err));

    } catch (error) {
        return res.status(500).send("erreur dans 'picture' du 'user' : " + error);
    }
};
