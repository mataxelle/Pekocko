const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceContrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // toujours après le middleware d'authetification




router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/', auth, sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;