const mongoose = require('mongoose');
const schema = mongoose.Schema;
const moment = require('moment');
const commentReplySchema = new schema({
        reply: { type: String, required: true },
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likes: {
            like: { type: Number, default: 0 },
            owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        },
        comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },


    }, { timestamps: { createdAt: 'createdat' } }

);


// populate fields
function populateUser(next) {
    this.populate({
        path: 'creator  comment ',
        select: ' -password -email'
    });
    next();
}
commentReplySchema.pre('find', populateUser);

module.exports = mongoose.model('CommentReply', commentReplySchema);