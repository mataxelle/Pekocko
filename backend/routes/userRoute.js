const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userContrl');

const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);



router.post('/signup', userCtrl.signup);
router.post('/login', bruteforce.prevent, userCtrl.login);  // bruteforce.prevent => error 429 if we hit this route too often


module.exports = router;