const mongoose = require('mongoose');
const schema = require('./schema');
const model = mongoose.model('CommentsModel', schema);
module.exports = model;