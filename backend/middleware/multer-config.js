const multer = require('multer');  // Multer permet de gérer les fichiers entrants dans les requêtes HTTP vers l'API

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


// Création d'objet de configuration pour multer
const storage = multer.diskStorage({ // Enregistrer sur le disque
    destination: (req, file, callback) => {
        callback(null, 'images')  // Les images seront stockées dans ce dossier
    },
    filename: (req, file, callback) => {
        /*la fonction filename indique à multer d'utiliser le nom d'origine,
        de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier*/
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];  // Utilisation de la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');