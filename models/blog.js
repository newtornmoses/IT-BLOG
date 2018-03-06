const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoschema = mongoose.Schema;
const postSchema = mongoschema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    blog: { type: String, required: true },
    image: String,
    //createdAt: { type: Date, default: Date.now() },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    likes: { type: Number, default: 0 },
    userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: { type: Number, default: 0 }

}, { timestamps: { createdAt: 'createdat' } });




module.exports = mongoose.model('Post', postSchema);