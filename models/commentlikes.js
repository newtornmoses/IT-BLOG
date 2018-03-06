const mongoose = require('mongoose');
const commentlikesSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //timestamps: { createdAT: 'createdat' }
});


commentlikesSchema.pre('find', function(next) {
    this.populate({
        path: 'user',
    })
    next();
})

module.exports = mongoose.model('Commentlikes', commentlikesSchema);