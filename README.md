# Pour démarrer l'application GROUPOMANIA

Il faudra `cloner` le "projet" sur son ordinateur dans un dossier reservé à l'application.

Ensuite, ouvrir le projet à partir de l'éditeur de code ( ex: vscode ).

A la base du dossier "back", accèder au dossier "config" puis ouvrez le fichier ".env.example".
En suivant les indications, vous devrez créer le fichier ".env" (au même niveau que le fichier ".env.example") en rentrant vos propres information.

À partir du terminal intégré, il faudra se rendre dans le dossier "back" et taper la commande suivante pour pouvoir installer toutes les dépendances liées à l'application :

`npm install`

Après l'installation du dossier node_modules, pour coordonnées les différentes versions installées, se rendre dans :

`node_modules` puis

`fs-temp` puis

`lib` puis

`white-stream.js` puis dans ce fichier remplacer à la ligne 6 :

`WriteStream.call(this, null, options)` par

`WriteStream.call(this, '', options)` et sauvegarder.

Rester dans le dossier "back", depuis le terminal, puis taper :

`nodemon server`

Cette action lancera le serveur.

Ouvrir un deuxième terminal, puis accèder au dossier "front" en tapant les commandes suivantes :
`cd front` puis "entrer".
puis taper :

`npm install`

Depuis le terminal, toujours dans le dossier "front", taper la commande suivante :

`npm start`

Cette action lancera l'application dans votre navigateur, sinon se rendre à l'adresse http://localhost:3000/ pour naviguer dans l'application.

Il vous faudra créer un compte pour accéder aux fonctionnalités de l'application, toutefois vous pourrez toujours y naviguer. Un contrôle de l'email vérifiera son format, tandis que le mot de passe devra faire au moins 8 caractères, contenir au moins 1 majuscule, 1 minuscule, 1 chiffre entier, un caractère spécial et pas d'espace.

Une fois le compte créé la première fois, il faudra saisir les identifiants pour se connecter.
