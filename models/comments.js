const mongoose = require('mongoose');
const schema = mongoose.Schema;
const commentSchema = schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentReply' }],
    likesUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 }

}, { timestamps: { createdAt: 'createdat' } });


module.exports = mongoose.model('Comments', commentSchema);