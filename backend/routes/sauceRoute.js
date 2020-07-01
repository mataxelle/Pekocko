const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauceContrl');
const auth = require('../middleware/auth');
const multer = require('multer'); // toujours après le middleware d'authetification

router.get('/', auth, multer, sauceCtrl.getAllSauces);

router.post('/', auth, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;