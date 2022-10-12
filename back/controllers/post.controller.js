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

const { json } = require("express");

const { error } = require("console");
const { send } = require("process");
const { request } = require("http");
//const { isEmpty } = require("../front/src/components/Utils");


// on exporte les méthodes "Post"

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
                `${__dirname}/../front/public/uploads/posts/${fileName}`
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
    //console.log(req.params.id)
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Post inconnu : " + req.params.id);

    const modifyPost = {
        message: req.body.message,
    };

    Post.findByIdAndUpdate(
        req.params.id,
        { $set: modifyPost },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    );

    // const postObject = req.file ? {
    //     imageUrl: req.file
    // } : {
    //     imageUrl: req.params.imageUrl
    // };
    // console.log(req.file);
    // // on implémente la logique pour supprimer l'ancienne image
    // // if (req.file !== null) {
    // //     Post.findOne({ _id: req.params.id }).then((post) => {
    // //         const imagFile = post.imageUrl.split("/uploads/")[1];
    // //         console.log("LE POST = " + post)
    // //         console.log("LE POST userId = " + post.userId)
    // //         //console.log("LE BODY userId = " + req.body.id)
    // //         console.log("l'imageUrl = ", imagFile);
    // //         fs.unlink(`front/public/uploads/${imagFile}`, (err) => {
    // //             if (err) throw err;
    // //             console.log('image du Post supprimée');
    // //         });
    // //     });
    // // }

    // Post.findOne({ _id: req.params.id })
    //     .then(async (post) => {
    //         //on déclare le nom de notre "image"
    //         let fileName = req.body.userId + Date.now() + ".jpg";
    //         // si il y a une image
    //         if (req.file !== undefined) {
    //             try {
    //                 if (
    //                     // on vérifie son format
    //                     req.file.detectedMimeType != "image/jpg" &&
    //                     req.file.detectedMimeType != "image/png" &&
    //                     req.file.detectedMimeType != "image/jpeg"
    //                 )
    //                     throw Error("invalid file");

    //                 if (
    //                     // on contrôle sa taille
    //                     req.file.size > 500000
    //                 )
    //                     throw Error("max size");
    //             } catch (error) {
    //                 // on récupère les erreurs pour les afficher dans le frontend
    //                 const errors = uploadErrors(error);
    //                 return res.status(201).json({ errors });
    //             }
    //             // on récupère le fichier qu'on importera dans "../images/post/"
    //             await pipeline(
    //                 req.file.stream,
    //                 fs.createWriteStream(
    //                     `${__dirname}/../front/public/uploads/posts/${fileName}`
    //                 )
    //             );
    //         } else {
    //             const newPost = {
    //                 message: req.body.message,
    //                 imageUrl: req.file !== null ? "./uploads/posts/" + fileName : "",
    //             };

    //             Post.findByIdAndUpdate(
    //                 req.params.id,
    //                 { $set: newPost },
    //                 { new: true },
    //                 (err, docs) => {
    //                     if (!err) res.send(docs);
    //                     else console.log("Update error : " + err);
    //                 }
    //             );
    //         }
    //     })
    //     .catch((error) => res.status(400).json({ error }));
};
// méthode pour supprimer un "post"
exports.deletePost = (req, res) => {
    // on vérifie si le "post" existe
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Post inconnu : " + req.params.id);
    }
    Post.findByIdAndRemove(
        req.params.id,
        (error, data) => {
            if (!error) {
                res.send(data);
                // if (data.imageUrl) {}
                // console.log("post sans image")
                const imageUrl = data.imageUrl.split("/uploads/")[1];
                fs.unlink("front/public/uploads/" + imageUrl, (err) => {
                    if (err) throw err;
                    console.log('image supprimée');
                });

            }
            else console.log("erreur dans 'delete' : " + error);
        });
}

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