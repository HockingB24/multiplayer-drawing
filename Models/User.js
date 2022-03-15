const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  Username: String,
  Messages: [
      String
  ],
});

module.exports = mongoose.model('User', userSchema)