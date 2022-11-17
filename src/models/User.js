const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    hash: String
});

module.exports = mongoose.model('user', UserSchema);