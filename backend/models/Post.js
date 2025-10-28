const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  mediaType: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
