const express = require('express');     // Import de Express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const helmet = require("helmet");

const sauceRoutes = require('./routes/sauceRoute');
const userRoutes = require('./routes/userRoute');

const app = express();

require('dotenv').config() // Permet de cacher des informations sensibles

app.use(helmet());     // Helmet est un module qui empêche
/*Les intrus peuvent utiliser cet en-tête (activé par défaut) afin de détecter 
les applications qui exécutent Express et lancer ensuite des attaques spécifiquement ciblées*/
// app.disable('x-powered-by');


// Logique métier pour se connecter à mongoDB
mongoose.connect('mongodb+srv://'+process.env.Mongo_Id+':'+process.env.Mongo_MP+'@cluster0-inviv.mongodb.net/'+process.env.Mongo_BDName+'?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


///////// middleware général //////// CORS
app.use((req, res, next) => {                         // Ces headers permettent :
    // une connection autorisée pour tous le monde
    res.setHeader('Access-Control-Allow-Origin', '*');
    // l'authorasation d'utiliser certains headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json()); // Pour toutes les routes de l'application, bodyParser transformera le coprs de la requête en objet json utilisable

  

////////// Chemin d'accès des endpoints ////////
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


//////// Exportation du server //////
module.exports = app;