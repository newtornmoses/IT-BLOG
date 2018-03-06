const mongoose = require('mongoose');
const bycrpt = require('bcrypt-nodejs');
const mongoschema = mongoose.Schema;

const userSchema = mongoschema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]


});

userSchema.methods.encryptpassword = function(password) {
    return bycrpt.hashSync(password, bycrpt.genSaltSync(5), null);
}

userSchema.methods.comparePassword = function(password) {
    return bycrpt.compareSync(password, this.password);
}




module.exports = mongoose.model('User', userSchema);