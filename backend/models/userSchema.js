const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    //userId: { type: String},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator); // Permet que deux utilisateurs ne partagent le même email

module.exports = mongoose.model('User', userSchema);