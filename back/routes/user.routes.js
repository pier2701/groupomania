const express = require('express')
// on utlise la méthode "routeur" de "express"
const router = express.Router();

// on utilise le module "multer" pour la gestion des images
const multer = require("multer");
const upload = multer();

// on met en place le "token"
const authController = require('../controllers/auth.controller');

// les routes "user"
const userController = require('../controllers/user.controller');

// le controller qui gérera l'image du profil
const uploadController = require('../controllers/upload.controller');



// route pour s'inscrire
router.post("/register", authController.signUp);

// route pour se connecter
router.post("/login", authController.signIn);

// route pour se déconnecter
router.get("/logout", authController.logout);

// route pour afficher les "users"
router.get("/", userController.getAllUsers);

// route pour afficher 1 seul "user"
router.get("/:id", userController.getOneUser);

// route pour modifier 1 "user"
router.put("/:id", userController.updateUser);

// route pour supprimer le "user"
router.delete("/:id", userController.deleteUser);

// route pour mettre à jour un [follow] du "user"
router.patch('/follow/:id', userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// la route qui va gérer les images 
router.post("/upload", upload.single("file"), uploadController.uploadProfileImage)

module.exports = router;