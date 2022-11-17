const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    authorName: String,
    content: String
});

module.exports = mongoose.model('message', MessageSchema);