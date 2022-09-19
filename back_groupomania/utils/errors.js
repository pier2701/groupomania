// on exploite les "error" d'inscription, pour les bonnes informations à l'utilisateur
exports.signUperrors = (error) => {
    let errors = { pseudo: "", email: "", password: "" };

    if (error.message.includes("pseudo"))
        errors.pseudo = "Pseudo incorrect ou déjà pris.";

    if (error.message.includes("email"))
        errors.email = "Votre email ne respecte pas le bon format.";

    if (error.message.includes("password"))
        errors.password = "Le mot de passe doit contenir minimum 8 caractères, une lettre en majuscule, une lettre en minuscule, au moins 2 chiffres et pas d'espace.";

    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("pseudo"))
        errors.pseudo = "Ce pseudo est malheureusement pris.";

    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("email"))
        errors.email = "Votre email est déjà enregistré.";

    return errors;
};

// on exploite les "error" de connection, pour les bonnes informations à l'utilisateur
exports.signInErrors = (error) => {
    let errors = { email: '', password: '' }

    if (error.message.includes("email"))
        errors.email = "Votre email ne correspond pas.";

    if (error.message.includes('password'))
        errors.password = "Votre mot de passe est incorrect."

    return errors;
}

// on exploite les erreurs d'image pour le front
exports.uploadErrors = (error) => {
    // on déclare le type d'erreur
    let errors = { format: '', maxSize: "" };

    if (error.message.includes('invalid file'))
        errors.format = "Format non correct";

    if (error.message.includes('max size'))
        errors.maxSize = "Le fichier dépasse 500ko";

    return errors
}