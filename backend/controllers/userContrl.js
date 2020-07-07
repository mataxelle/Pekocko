const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  // La fonction de hachage de bcrypt permet de « saler » le mot de passe 10 fois, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé
    .then(hash => {   // La fonction asynchrone renvoie une Promise dans laquelle nous recevons le hash généré
        const user = new User({    //  Création d'un utilisateur qui sera ensuite enregistré dans la base de données
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })  // Trouver le user qui tente de se connecter
    .then(user => {
        if (!user) {  // Si il est inconnu 
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // la fonction compare de bcrypt permet de comparer le mp entré par le user avec le hash enregistré dans la base de données
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(       // la fonction sign de jsonwebtoken encode un nouveau token
                    { userId: user._id },
                    process.env.Token,    // Clé token
                    { expiresIn: '8h'}    // Durée de validité du token. L'utilisateur devra se reconnecter au bout de 4h
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};