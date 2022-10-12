const User = require("../models/user");

module.exports = (req, res, next) => {
    const body = req.body;

    const userId = body.userId;

    res.locals.isAdmin = false;

    User.findOne({ _id: userId })
        .then((user) => {
            if (user && user.admin)
                res.locals.isAdmin = true;
        })
        .catch(() => res.locals.isAdmin = false);

    next();
};