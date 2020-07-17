const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Créer et vérifier les tokens
const User = require('../models/userSchema');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

const schema = new passwordValidator(); // Création d'un schéma pour la validitée du mp

schema
.is().min(7)
.is().max(20)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().symbols()
.has().not().spaces();



exports.signup = (req, res, next) => {
    if (!emailValidator.validate(req.body.email) || !schema.validate(req.body.password)) { // Vérifie si valide 
        throw { error: 'Attention, veuillez utiliser un email et un pot de passe valide !' }
    } else {
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
    }//}
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })  // Trouver le user qui tente de se connecter car email unique
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
                userId: user._id,      // Si la comparaison est bonne, on revoi au user son id et un token
                token: jwt.sign(       // la fonction sign de jsonwebtoken encode un nouveau token
                    { userId: user._id },    // Pour être sûr qu'il s'agit bien du user id
                    process.env.S_TOKEN,    // Clé token
                    { expiresIn: '8h'}    // Durée de validité du token. L'utilisateur devra se reconnecter au bout de 4h
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};