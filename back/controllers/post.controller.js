// on récupère le model "Post"
const Post = require("../models/post");

// on récupère le model "User"
const User = require("../models/user");

// on importe une fonction qui exploitera les "error" pour le front
const { uploadErrors } = require("../utils/errors");

// le module "fs" nous permettra de manipuler des fichiers
const fs = require("fs");

// module qui va nous permettre d'exploiter le "stream" qui contiendra notre fichier
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// on récupère "_id" de MongoDB via une variable
const ObjectId = require('mongoose').Types.ObjectId;

const { json, query } = require("express");

const { error } = require("console");
const { send } = require("process");
const { request } = require("http");

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

// méthode pour créer un "post"
exports.createPost = async (req, res) => {
    // on déclare le nom de notre "image"
    let fileName = req.body.userId + Date.now() + ".jpg";
    // si il y a une image
    if (req.file !== null) {
        try {
            if (
                // on vérifie son format
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
            )
                throw Error("invalid file");

            if (
                // on contrôle sa taille
                req.file.size > 500000
            )
                throw Error("max size");
        } catch (error) {
            // on récupère les erreurs pour les afficher dans le frontend
            const errors = uploadErrors(error);
            return res.status(201).json({ errors });
        }
        // on récupère le fichier qu'on importera dans "../images/post/"
        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../front/public/uploads/posts/${fileName}`
            )
        );
    }

    // on récupère le model du "Post"
    const newPost = new Post({
        userId: req.body.userId,
        message: req.body.message,
        // le champ sera vide s'il n'y a pas d'image
        imageUrl: req.file !== null ? "./uploads/posts/" + fileName : "",
        likers: [],
        comments: [],
    });
    console.log("newPost : " + newPost)
    try {
        // // on enregistre l'objet dans la base avec la méthode "save()"
        const post = await newPost.save();
        return res.status(201).json(post);
    }
    catch (err) {
        return res.status(400).send(err);
    }
};

// la méthode pour afficher touts les "post"
exports.readAllPosts = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // affichage antéchronologique
        // on affiche les "post" 
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).send("erreur dans 'readAll' : " + error));
};

// on récupère la logique pour afficher 1 seul "Post"
exports.getOnePost = (req, res) => {
    // route pour accèder à la page de 1 seul produit
    Post.findOne({ _id: req.params.id })
        .then((post) => res.status(200).json(post))
        // error 401 pour dire que le "post" n'est pas trouvé
        .catch((error) => res.status(401).send("erreur dans 'getOne' : " + error));
};

// méthode pour modifier un "post"
exports.updatePost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    //on met en place la logique pour "récupèrer" l'image et la supprimer de la base de données
    if (req.file) {
        Post.findOne({ _id: req.params.id })
            .then((post) => {
                // on récupère le nom de l'image
                const imgFile = post.imageUrl.split("/uploads/")[1];
                console.log("l'imageUrl = ", imgFile);

                // on supprime l'image du dossier "images"
                fs.unlink("../front/public/uploads/" + imgFile, (err) => {
                    if (err) throw err;
                    console.log('image supprimée');
                });
            })
            .catch((err) => { throw err; });
    }

    // on récupère le "user" du Post via le "token"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (error, clearToken) => {
            if (error) {
                console.log(error);
                res.send(200).json('Connection non-autorisée : ' + error)
            } else {
                // on identifie le "Post"
                Post.findById(req.params.id)
                    .then((post) => {

                        // on compare l'Id du "user"
                        User.findOne({ _id: clearToken.id })
                            .then((user) => {
                                if (clearToken.id === post.userId || user.admin === true) {
                                    console.log("User identifié")
                                    // on déclare le nom de notre "image"
                                    let fileName = post.userId + Date.now() + ".jpg";

                                    // si il y a une nouvelle image
                                    if (req.file) {
                                        // on récupère le fichier qu'on importera
                                        pipeline(
                                            req.file.stream,
                                            fs.createWriteStream(
                                                `${__dirname}/../../front/public/uploads/posts/${fileName}`
                                            )
                                        );
                                    }
                                    console.log("fileName : " + fileName)

                                    // on déclare les modifications dans une variable
                                    const modifyPost = {
                                        message: req.body.message !== "null" ? req.body.message : post.message,
                                        imageUrl: req.file ? "./uploads/posts/" + fileName : post.imageUrl,
                                    };
                                    console.log("ancienne image : " + post.imageUrl)
                                    console.log("nouvelle image : " + modifyPost.imageUrl)

                                    // on met à jour le "Post"
                                    Post.findByIdAndUpdate(
                                        req.params.id,
                                        { $set: modifyPost },
                                        { new: true },
                                    )
                                        .then((docs) => res.send(docs))
                                        .catch((error) => console.log("Erreur Update = " + error))

                                    console.log("post modifié")
                                    console.log(post);

                                } else {
                                    console.log('Modification non-autorisée');
                                };
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    // error 401 pour dire que le "post" n'est pas trouvé
                    .catch((error) => res.status(401).send("erreur dans 'findById' : " + error));
            }
        });
    } else {
        console.log('Connection non-autorisée');
    }
};
// méthode pour supprimer un "post"
exports.deletePost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Post inconnu : " + req.params.id);
    }

    // on récupère le "user" du Post via le "token"
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, clearToken) => {
            if (error) {
                console.log(error);
                res.send(200).json('Connection non-autorisée : ' + error)
            } else {
                console.log("le userId de la req : " + clearToken.id);
                Post.findOne({ _id: req.params.id })
                    .then((post) => {
                        User.findOne({ _id: clearToken.id })
                            .then((user) => {
                                //console.log(user)
                                if (clearToken.id === post.userId || user.admin === true) {
                                    console.log("User identifié")
                                    Post.findByIdAndRemove(
                                        req.params.id,
                                        (error, data) => {
                                            if (!error) {
                                                res.send(data);
                                                if (data.imageUrl) {
                                                    console.log("DATA.imageURL = " + data.imageUrl)
                                                    const imageUrl = data.imageUrl.split("/uploads/")[1];
                                                    console.log("imageURL = " + imageUrl)
                                                    fs.unlink("../front/public/uploads/" + imageUrl, (err) => {
                                                        if (err) throw err;
                                                        console.log('image supprimée');
                                                    });
                                                } else {
                                                    console.log("post sans image");
                                                }
                                            }
                                            else console.log("erreur dans 'delete' : " + error);
                                        });
                                    console.log("post supprimé");

                                } else {
                                    console.log('Suppression non-autorisée');
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })

                    }
                    )
                    // error 401 pour dire que le "post" n'est pas trouvé
                    .catch((error) => res.status(401).send("erreur dans 'getOne' : " + error));
            }
        });
    } else {
        console.log('Connection non-autorisée');
    }
};

// méthode pour "like" un "post"
exports.likePost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    // on récupère le "post"
    Post.findByIdAndUpdate(
        req.params.id,
        // on incrémente [likers] du "Post"
        {
            $addToSet: { likers: req.body.id },
        },
        { new: true },
        (error, result) => {
            if (error) {
                return res.status(500).send("erreur dans 'add_likers' : " + error)
            }
            // sinon, on récupère le "User"
            User.findByIdAndUpdate(
                req.body.id,
                // on incrémente [likes] du "User"
                {
                    $addToSet: { likes: req.params.id },
                },
                { new: true })
                .then((data) => res.send(data))
                .catch(error => {
                    return res.status(500).send("erreur dans 'add_likes' : " + error)
                })
        }
    )
}

// méthode pour "unlike" un "post"
exports.unlikePost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    // on récupère le "post"
    Post.findByIdAndUpdate(
        req.params.id,
        // on décrémente [likes] du "User"
        {
            $pull: { likers: req.body.id },
        },
        { new: true },
        (error, result) => {
            if (error) {
                return res.status(500).send("erreur dans 'pull_likers' : " + error)
            }
            // on récupère le "User"
            User.findByIdAndUpdate(
                req.body.id,
                // on décrémente [likes] du "User"
                {
                    $pull: { likes: req.params.id },
                },
                { new: true })
                .then((data) => res.send(data))
                .catch(error => {
                    return res.status(500).send("erreur dans 'pull_likes' : " + error)
                })
        }
    )
};

// méthode pour commmenter un "post"
exports.commentPost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    // on récupère le "post"
    Post.findByIdAndUpdate(
        req.params.id,
        {
            // on incrémente le [comment]
            $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime(),
                },
            }
        },
        { new: true })
        .then((data) => res.send(data))
        .catch((error) => res.status(500).send("erreur dans 'comment' : " + error));
};
// méthode pour modifier un commmentaire sur un "post"
exports.editCommentPost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    // on recherche le "comment"
    Post.findById(req.params.id, (error, data) => {
        // on stocke le "comment" spécifique dans une variable
        const pastComment = data.comments.find((comment) =>
            // on compare la DB et le corps de la requête
            comment._id.equals(req.body.commentId)
        );

        if (!pastComment)
            return res.status(404).send("le 'comment' est introuvable : " + error);
        // sinon on met à jour le "comment"
        pastComment.text = req.body.text;

        // on sauvegarde le nouveau "comment"
        return data.save((error) => {
            if (!error) return res.status(200).send(data);
            return res.status(500).send("erreur dans 'editComment' : " + error);
        });
    });
};

// méthode pour supprimer un commmentaire sur un "post"
exports.deleteCommentPost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    // on récupère le "comment" à supprimer
    Post.findByIdAndUpdate(
        req.params.id,
        {
            // on retire le "comment" du "post"
            $pull: {
                comments: { _id: req.body.commentId },
            }
        },
        { new: true })
        .then((data) => res.send(data))
        .catch((error) => res.status(500).send("erreur dans 'deleteComment' : " + error))
};