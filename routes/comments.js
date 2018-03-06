const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const comment = require('../models/comments');
const blog = require('../models/blog');
const reply = require('../models/Commentreply');
const user = require('../models/users');
const userlikes = require('../models/userlikes');
const Commentlikes = require('../models/commentlikes')


router.get('/comments', (req, res) => {
    comment.find()


    .populate('creator')
        .populate('comments')
        .populate('reply')
        .populate('comment_likes')
        .populate('likesUsers')

    .then(data => {
            res.json(data);

        })
        .catch(err => res.json(err))
});


// get comment by post

router.get('/comments/:postid', (req, res) => {
    comment.find({ post: req.params.postid })
        .populate('post')
        .populate('creator')
        .populate('comments')
        .populate('likesUsers')
        .then(data => {
            res.json(data);

        })
        .catch(err => res.json(err))
});

// post a comment
router.post('/comments/:id', (req, res) => {
    const newcomments = new comment();
    newcomments.comment = req.body.comment;
    newcomments.post = req.params.id;
    newcomments.creator = req.user;

    newcomments.save((err, Savedcomment) => {
        if (err) {
            console.log(err)
        }
        res.json(Savedcomment)


    })

});




// comment reply
router.post('/commentreply/:id', (req, res) => {

    comment.findById({ _id: req.params.id })
        .then(article => {


            const newreply = new reply({
                reply: req.body.reply,
                creator: req.user,
                _comment: article._id,
                likes: {
                    like: 0,
                    owner: req.user
                }
            });
            console.log(req.user)

            if (req.user !== undefined) {


                newreply.save((err, savedReply) => {
                    if (err) {

                        console.log('bad data..check your input');

                    }




                    comment.findByIdAndUpdate({ _id: req.params.id }, { $push: { reply: savedReply } }, (err, saved) => {
                        if (err) {
                            res.json(err)
                        }
                        res.json({
                            msg: 'success',
                            savedReply
                        });

                    })




                })
            } else {
                res.json('please login')
            }



        }).catch(err => console.log(err));


});


// like a comment
router.post('/commentLikes/:id', (req, res) => {


    comment.findById({ _id: req.params.id }, { likesUsers: req.user._id })
        .then(data => {
            //check if user already liked the comment
            if (data.likesUsers.indexOf(req.user._id) === -1) {
                comment.findByIdAndUpdate({ _id: req.params.id }, { $push: { likesUsers: req.user } })
                    .then(updatedData => {
                        comment.findByIdAndUpdate({ _id: req.params.id }, { $set: { likes: updatedData.likes + 1 } })
                            .then(incrementLikes => {
                                //console.log(updatedData)
                                // res.redirect('back')
                                res.json(Number(1))


                            })

                    })

            }
            if (data.likesUsers.indexOf(req.user._id) != -1) {
                comment.findByIdAndUpdate({ _id: req.params.id }, { $pull: { likesUsers: req.user._id } })
                    .then(updatedData => {
                        comment.findByIdAndUpdate({ _id: req.params.id }, { $set: { likes: updatedData.likes - 1 } })
                            .then(incrementLikes => {
                                //console.log(updatedData)
                                //res.redirect('back')
                                res.json(Number(-1))

                            })

                    })
            }
        })

})




// single user
router.get('/user/:id', (req, res) => {
    user.findById({ _id: req.params.id }, (err, user) => {
        res.json(user)
    })
})


// comment by id
router.get('/reply', (req, res) => {
    reply.find({})
        .populate('likes.owner')
        .then(data => {
            res.json(data);
        }).catch(err => console.log(err))

})


module.exports = router;