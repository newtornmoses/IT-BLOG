const mongoose = require('mongoose');
const userlikesSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('Userlike', userlikesSchema);