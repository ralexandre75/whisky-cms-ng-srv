const mongoose = require('mongoose');

const blogpostsSchema = new mongoose.Schema({
    title: String,
    subTitle: String,
    image: String,
    content: String,
    createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', blogpostsSchema);