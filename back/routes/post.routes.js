// on importe express et sa la méthode "routeur"
const express = require('express');

// on utlise la méthode "routeur" de "express"
const router = express.Router();

// on utilise le module "multer" pour la gestion des images dans "post"
const multer = require("multer");
const upload = multer();

// importation des "post" créé le dossier "controllers"
const postCtrl = require("../controllers/post.controller");

// on implémente les chemin du rôle "admin"
const isAdmin = require("../middleware/isAdmin");

// la route vers laquelle nous intercepterons les requêtes de type GET de toutes les posts
router.get("/", postCtrl.readAllPosts);

//route de type GET pour 1 seul objet/article avec requête "params" de l'id
router.get("/:id", postCtrl.getOnePost);

// le " / " du fichier "post" sera la route vers laquelle nous intercepterons les requêtes de type POST
router.post("/", upload.single("file"), postCtrl.createPost);

// route de type PUT request pour modifier un article
router.put("/:id", postCtrl.updatePost);

// route de type DELETE request pour supprimer un article
router.delete("/:id", postCtrl.deletePost);

// les routes vers laquelle nous intercepterons les requêtes de type PATCH des "like/unlike"
router.patch('/like/:id', postCtrl.likePost);
router.patch('/unlike/:id', postCtrl.unlikePost);

// les routes de type PATCH pour commenter des "post"
router.patch('/comment-post/:id', postCtrl.commentPost);
router.patch('/edit-comment-post/:id', postCtrl.editCommentPost);
router.patch('/delete-comment-post/:id', postCtrl.deleteCommentPost);

// on exporte la méthode "router"
module.exports = router;