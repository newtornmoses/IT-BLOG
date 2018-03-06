const mongoose = require('mongoose');
const authorSchema = mongoose.Schema({
    image: { type: String, required: true }
}, { timestamps: { createdAt: 'createdat' } });

module.exports = mongoose.model('Upload', authorSchema);