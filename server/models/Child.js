const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  personality: String
});

module.exports = mongoose.model('Child', ChildSchema);