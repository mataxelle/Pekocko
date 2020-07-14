const Sauce = require('../models/sauceSchema'); // Import du schéma sauseSchema
const fs = require('fs');  // Ce package de node permet de supprimer un fichier de la base de donnée


// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()  // Cette méthode enregistre l'objet Sauce dans la base et retourne un promise
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce grâce à son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // UpdateOne( {1: objet de comparaison pour savoir quel objet on modifie}, {2: la nouvelle version de l'objet, 3: l'id correspond à celui des paramètres pour être sûr})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupération/Affichage de la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


// Appréciations
exports.likeOrDislike = (req, res, next) => {

    const userId = req.body.userId;
    const likes = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (likes) {
                case 1:                          // Si userID ajoute un like, incrémentaion +1 dans la tableau like
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $inc: {likes: 1}, $push: {usersLiked: userId}, _id: req.params.id})
                        .then(() => res.status(201).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case 0:                          // Si userId supprime son like ou son dislike, décrémentation des tableaux
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: userId}, _id: req.params.id} )
                        .then(() => res.status(201).json({ message: 'Vote supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                    } else if (!sauce.usersDisliked.includes(userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId} , _id: req.params.id})
                        .then(() => res.status(201).json({ message: 'Vote supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case -1:                         // Si userId supprime son like, incrémentaion +1 dans la tableau dislike
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: 1}}, { $push: {usersdisliked: userId}, _id: req.params.id})
                        .then(() => res.status(201).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                    }
                    break;

                default:
                    break;
            }
        })
        .catch(error => res.status(400).json({ error }));
}