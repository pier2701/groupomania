const UserModel = require('../models/user');

// on récupère "_id" de MongoDB via une variable
const ObjectId = require('mongoose').Types.ObjectId;

// on affiche les "users"
exports.getAllUsers = async (req, res) => {
    // on récupére tout les users en json sauf le password
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

// on affiche 1 seul user
exports.getOneUser = async (req, res) => {
    // on compare "_id" avec la base de données
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Numéro d'Id " + req.params.id + " introuvable")

    // sinon on envoie les "data"
    UserModel.findById(req.params.id, (error, data) => {
        if (!error) res.send(data);
        else console.log("Numéro d'Id " + req.params.id + " introuvable");
    }).select('-password')
};

// on rajoute une biographie à "user"
exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Numéro d'Id " + req.params.id + " introuvable ")

    try { // sinon on met à jour les données via "$set"
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { bio: req.body.bio, } },
            { new: true, upsert: true, setDefaultsOnInsert: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

// on supprime un "user"
exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Numéro d'Id " + req.params.id + " introuvable ")

    try { // sinon on supprime l'Id de l'URI
        await UserModel.deleteOne({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Utilisateur " + req.params.id + " supprimé." })
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
};


// on créé la logique pour la gestion des [follow]
exports.follow = (req, res) => {
    UserModel.findByIdAndUpdate(req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            UserModel.findByIdAndUpdate(req.params.id,
                { $addToSet: { following: req.body.idToFollow } },
                { new: true }).select("-password")
                .then(result => { res.json(result) })
                .catch(err => {
                    return res.status(422).json({ error: err })
                })
        }
    )
}


// on créé la logique pour la gestion des [unfollow]
exports.unfollow = (req, res) => {
    //on décrémente le [] des [followers]
    UserModel.findByIdAndUpdate(req.body.idToUnfollow, {
        $pull: { followers: req.params.id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            //on décrémente le [] des [followers]
            UserModel.findByIdAndUpdate(req.params.id,
                { $pull: { following: req.body.idToUnfollow } },
                { new: true }).select("-password")
                .then(result => { res.json(result) })
                .catch(err => {
                    return res.status(422).json({ error: err })
                })
        }
    )
}
