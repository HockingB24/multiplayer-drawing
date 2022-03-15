const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
  User: String,
  Body: String,
});

module.exports = mongoose.model('Messages', messageSchema)