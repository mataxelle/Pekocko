const express = require('express');
const router = express.Router();  // Création d'un routeur express
const sauceCtrl = require('../controllers/sauceContrl');
const auth = require('../middleware/auth'); // ajout middleware d'authentification pour sécuriser les routes. De cette façon, seules les requêtes authentifiées seront gérées.
const multer = require('../middleware/multer-config'); // toujours après le middleware d'authetification. Pour les fichiers entrants


///////// Logique de route /////////

router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/', auth, sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeOrDislike)


module.exports = router;