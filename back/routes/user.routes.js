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

// on implémente la logique d'authentification
const { checkUser } = require('../middleware/auth.middleware')

// la route qui va gérer les images 
router.post("/upload", upload.single("file"), uploadController.uploadProfileImage)

// route pour s'inscrire
router.post("/register", authController.signUp);

// route pour se connecter
router.post("/login", authController.signIn);

// route pour se déconnecter
router.get("/logout", authController.logout);

// route pour afficher les "users"
router.get("/", checkUser, userController.getAllUsers);

// route pour afficher 1 seul "user"
router.get("/:id", checkUser, userController.getOneUser);

// route pour modifier 1 "user"
router.put("/:id", checkUser, userController.updateUser);

// route pour supprimer le "user"
router.delete("/:id", checkUser, userController.deleteUser);

// route pour mettre à jour un [follow] du "user"
router.patch('/follow/:id', checkUser, userController.follow);
router.patch("/unfollow/:id", checkUser, userController.unfollow);

module.exports = router;