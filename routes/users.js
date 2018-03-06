const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const Localstrategy = require('passport-local').Strategy;




// get register Form
router.get('/signup', (req, res) => {


    res.render('signup')
})


// get login Form

router.get('/login', protectRoutes, (req, res) => {


    res.render('login');
});

// reigister user
router.post('/signup', passport.authenticate('user_signin', {
        // successRedirect: ('/api/shop'),
        failureRedirect: ('/users/signup'),
        failureFlash: true
    }),
    (req, res) => {
        res.redirect(req.session.url);
    }

);


// login user
router.post('/login', passport.authenticate('login-user', {

        // successRedirect: ('/api/shop'),
        failureRedirect: ('/users/login'),
        failureFlash: true
    }),
    (req, res) => {
        res.redirect(req.session.url);
    }

);



// route protection
function protectRoutes(req, res, next) {

    if (req.isAuthenticated()) {
        req.flash('success', 'You are already logged in')

    } else {
        next();
    }
}



// log out user
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('danger', 'You are logged out');
    res.redirect('back');
});


// get all users
router.get('/registered', (req, res) => {
    User.find()
        .populate('posts')
        .exec()
        .then(data => {

            res.json(data)
        })
        .catch(err => res.json(err))
});


module.exports = router;