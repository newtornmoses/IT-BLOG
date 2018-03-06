const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const User = require('../models/users');


passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
});
//  user sign up
passport.use('user_signin', new Localstrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,

    }, (req, email, password, done) => {
        req.checkBody('email', 'invalid email').isEmail();
        req.checkBody('password', 'password must be 6 or more characters').isLength({ min: 6 });

        var errors = req.validationErrors();
        var messages = [];

        if (errors) {
            errors.forEach(error => messages.push(error.msg));
            if (req.session) {
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.username = req.body.username;

            }

            return done(null, false, { email: email }, req.flash('error', messages));
        }
        User.findOne({ 'email': email }, (err, user) => {
            if (err) {
                req.flash('danger', 'some thing wrong happened');
                done(null, false, { 'msg': 'some thing wrong happened' });

            }

            if (user) {

                req.flash('danger', 'user ' + email + ' already exists');
                done(null, false, { 'msg': ' email alrady exists' });

            }
            if (!user) {
                const newuser = new User();
                newuser.email = req.body.email;
                newuser.username = req.body.username;
                newuser.password = newuser.encryptpassword(req.body.password);


                newuser.save((err, user) => {
                    if (err) {
                        console.log(err);
                        req.flash({ 'danger': 'some thing went wrong' });

                    }



                    req.flash('success', 'successfull added user');

                    return done(null, user);

                });
            }
        });
    }

));


// login

passport.use('login-user', new Localstrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({ 'email': email }, (err, user) => {

            if (err) {
                return done(null, false, { msg: ' something went wrong' })
            }
            if (!user) {
                return done(null, false, { msg: 'user doesnot exist' })
            }
            if (!user.comparePassword(password)) {
                return done(null, false, { msg: 'invalid password' });
            }
            req.flash('success', 'you are successfully logged in');
            return done(null, user);
        });

    }
))