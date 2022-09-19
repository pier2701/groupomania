// on rajoute un "plug-in" qui contrôlera les contraintes du mot de passe
const passwordValidator = require("password-validator");

let pwdValidate = new passwordValidator();
pwdValidate
    .is()
    .min(6)
    .is()
    .max(40)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(2)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]);

// on exporte le module
module.exports = (req, res, next) => {
    // on teste le mot de passe de passe du corps de la requête
    if (pwdValidate.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({
            message:
                "Le mot de passe doit contenir minimum 8 caractères, une lettre en majuscule, une lettre en minuscule, au moins 2 chiffres et pas d'espace",
        });
    }
};