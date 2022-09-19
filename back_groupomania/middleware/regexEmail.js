// on exporte la méthode de contrôle
module.exports = (req, res, next) => {
    // on rajoute un plugin pour contrôler le format de l'email
    console.log(req.body.email);
    // déclaration de la validation par regex pour l'Email
    const newEmailRegex = new RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    // déclaration de la validation par regex pour l'Email
    const regexEmail = newEmailRegex;

    // test du champ "email" par regex
    let testEmail = regexEmail.test(req.body.email);

    testEmail ? next() : res.status(400).json({ message: "Votre email ne respecte pas le bon format." });
};