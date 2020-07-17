const jwt = require('jsonwebtoken'); // Créer et vérifier les token


// Création de TOKEN pour l'authentification
module.exports = (req, res, next) => {
    try {
        /* On extrait le token du header Autho de la requête entrante.
        Il contiendra également le mot-clé Bearer . 
        Utilisation donc de la fonction split pour récupérer tout après l'espace dans le header. */
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.S_TOKEN); // verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
       const userId = decodedToken.userId;
       if(req.body.userId && req.body.userId !== userId) {
           throw 'User ID non valable !';
       } else {
           next();
       }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};