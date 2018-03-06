const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/users');
const blog = require('../models/blog');
const authorImage = require('../models/Authorupload');
const comment = require('../models/comments');
const message = require('../models/contactus');
const reply = require('../models/Commentreply');
const passport = require('passport');
const commentLikes = require('../models/commentlikes');
const multer = require('multer');

// file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// author image upload
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/profilepic/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const imageUpload = multer({ storage: imageStorage });



// about us
router.get('/aboutus', (req, res) => {

    authorImage.find({})
        // .limit(6)
        .exec()

    .then(authorpic => {
        console.log(authorpic)

        res.render('about', { authorpic });
    })
})



router.get('/blog', (req, res) => {
    blog.find()
        .populate('comments')
        .populate('creator')
        .then(items => {
            var admin;
            if (req.user) {
                if (req.user.email === 'kingdomfilmz4x4@gmail.com') {
                    req.user.isAdmin = true
                    admin = req.user.isAdmin;
                }

            }
            const user = req.user;
            req.session.url = req.originalUrl;

            authorImage.find({})
                // .limit(6)
                .exec()

            .then(authorpic => {
                console.log(authorpic)


                res.render('home', { items: items, admin: admin, authorpic: authorpic })

            })
        })
        .catch(err => console.log(err));
});

// get all articles json
router.get('/blogJson', (req, res) => {
    blog.find()
        .populate('comments')
        .populate('creator')
        .then(items => {

            res.json({
                success: true,
                count: items.length,
                items: items
            })
        })
        .catch(err => console.log(err));
});




//add new article
router.post('/addArticle', upload.single('image'), (req, res) => {
    console.log(req.file)
    const newblog = new blog({
        creator: req.user,
        title: req.body.title,
        image: '/images/' + req.file.originalname,
        description: req.body.description,
        blog: req.body.blog
    });

    newblog.save((err, createdBlog) => {
        res.json({
            msg: 'successfully created new article',
            article: createdBlog
        })
    });
});

// upload author image
router.post('/AuthorImageupload', imageUpload.single('image'), (req, res) => {
    console.log(req.file);
    const authorPic = new authorImage();
    authorPic.image = '/profilepic/' + req.file.originalname;

    authorPic.save((err, authorpic) => {
        if (err) {
            console.log(err)
        }
        if (authorpic) {
            console.log(authorpic);
            req.flash('success', 'success fully uploaded profile picture');
            res.redirect('back')

        }
    })

});


//get single doc

router.get('/blog/:id', (req, res) => {
    blog.findById(req.params.id)
        .populate('comments')
        .populate('creator')
        .exec()
        .then(post => {
            if (req.user) {
                if (req.user.email === 'kingdomfilmz4x4@gmail.com') {
                    req.user.isAdmin = true

                }
                console.log(req.user)
            }

            return blog.find({ _id: { $ne: req.params.id } })
                .limit(6)
                .exec()
                .then(data => {
                    let commentcount = 0;
                    comment.find({ post: req.params.id })
                        .count()
                        .then(number => {
                            commentcount = number;
                            console.log(commentcount)
                        });


                    return comment.find({ post: req.params.id })
                        .populate('creator')
                        .populate('_comment')
                        .populate('reply')
                        .populate('comment_likes')
                        .populate('likesUsers')
                        .exec()
                        .then(comment => {

                            blog.aggregate({ $sample: { size: 6 } })
                                .then(randomPosts => {
                                    authorImage.find({})
                                        // .limit(6)
                                        .exec()

                                    .then(authorpic => {
                                        console.log(authorpic)


                                        commentLikes.count()
                                            .then(likescount => {

                                                req.session.url = req.originalUrl;


                                                res.render('singledoc', { post, data, comment, commentcount, randomPosts, authorpic });

                                            })

                                    });
                                })
                        })
                });



        })
        .catch(err => {
            console.log(err.toString())
        })

    //res.render('index', single_blog);
});




//edit  article
router.put('/blog/edit/:id', upload.single('image'), (req, res) => {
    console.log(req.file)
    const article = {};
    article.title = req.body.title;
    article.blog = req.body.blog;
    article.image = '/images/' + req.file.originalname,
        article.description = req.body.description;

    blog.findByIdAndUpdate({ _id: req.params.id }, { $set: article })
        .then(update => {
            blog.findByIdAndUpdate({ _id: req.params.id })
                .then(found => {
                    res.json(found)
                })


        })
        .catch(err => res.json(err))
});

// delete single article

router.get('/blog/delete/:id', (req, res) => {
    if (req.user) {
        if (req.user.email === 'kingdomfilmz4x4@gmail.com') {
            req.user.isAdmin = true

            if (req.params.id === undefined) {
                res.redirect('back')
            }
            blog.findByIdAndRemove({ _id: req.params.id })
                .then(data => {
                    req.flash('success', 'successfully deleted Post')
                    res.redirect('/api/blog');
                    // blog.find({})
                    //     .then(remainingPosts => {
                    //         res.json(remainingPosts);
                    //     })

                })
                .catch(err => res.json(err))

        }

    }
});

//add comments
router.post('/comments/:id', (req, res) => {
    blog.findById({ _id: req.params.id }, (err, blogFound) => {

        const comments = new comment({
            comment: req.body.comment

        });

        comments.save((err, commentCreated) => {
            if (err) {
                res.json(err);

            }
            res.json({
                success: true,
                data: commentCreated
            });
        })
    })

});

// Post likes
router.post('/postlikes/:id', (req, res) => {

    if (req.user !== undefined) {
        blog.findById({ _id: req.params.id }, { userLikes: req.user._id })

        .then(likesdata => {

            if ((likesdata.userLikes.indexOf(req.user._id) === -1)) {
                liketotal = {}
                liketotal.likes = liketotal.likes + 1
                blog.findByIdAndUpdate({ _id: req.params.id }, { $push: { userLikes: req.user._id } })
                    .then(updatedData => {

                        blog.findByIdAndUpdate({ _id: req.params.id }, { $set: { likes: updatedData.likes + 1 } })
                            .then(addedLike => {

                                blog.findById({ _id: req.params.id })
                                    .then(finalSearch => {
                                        console.log('addelike ' + finalSearch)
                                        res.json(finalSearch)
                                    })

                            })
                    })
            }

            if (likesdata.userLikes.indexOf(req.user._id) != -1) {
                blog.findByIdAndUpdate({ _id: req.params.id }, { $pull: { userLikes: req.user._id } }, { $set: { likes: likesdata.likes - 1 } })

                .then(updatedData => {
                    blog.findByIdAndUpdate({ _id: req.params.id }, { $set: { likes: updatedData.likes - 1 } })
                        .then(removedLike => {

                            blog.findById({ _id: req.params.id })
                                .then(finalSearch => {
                                    console.log('removed ' + finalSearch)

                                    res.json(finalSearch)
                                })
                        });





                });

            }

        })
    } else {
        res.json('please login')
    }

});

//find likes by id
router.get('/likes/:id', (req, res) => {
    blog.findById({ _id: req.params.id }, 'likes -_id', (err, data) => {
        res.json({
            success: true,
            count: {
                actual: data.likes,
                incremented: data.likes + 1
            }
        });


    });

});

// contactus 
router.post('/contactus', (req, res) => {
    const newMessage = new message({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    newMessage.save((err, saved) => {
        if (err) {
            console.log(err)
        }
        req.flash('success', 'successfully sent message.. we\'ll get back to you soon');
        res.redirect('back');
    })
})


//search

router.get('/:search', (req, res) => {
    var search = req.params.search


    blog.find({ title: new RegExp(search, 'i') })
        .then(data => {
            res.json({
                params: req.params.search,
                data
            })
        })
})





module.exports = router;