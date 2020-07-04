const mongoose = require('mongoose');  // Récupération de mongoose


// Schéma/Model de la sauce
const sauceSchema = mongoose.Schema({
    // id: { type: String, required: true }. Inutile car sera généré automatiquement par mongoDB
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, required: false, default: 0},
    dislikes: { type: Number, required: false, default: 0},
    usersLiked: { type: [String], required: false, default: 0},
    usersDisliked: { type: [String], required: false, default: 0},
});

module.exports = mongoose.model('Sauce', sauceSchema); // Le schéma appelé Sauce sera exporté en tant que modèle monngoose