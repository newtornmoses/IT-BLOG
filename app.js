const express = require('express');
const Path = require('path');
const app = express();
const hbs = require('express-handlebars');
const bodyparser = require('body-parser');
const validator = require('express-validator');
const cookie = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const store = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

//database connection
mongoose.connect('mongodb://localhost:27017/techblog');

//listen to db connection
mongoose.connection.on('open', () => {
    console.log('server connected to mongo DB')
});

// passport
require('./config/passport');


// port
const port = process.env.PORT || 8000;

// routes
const api = require('./routes/api');
const users = require('./routes/users');
const comments = require('./routes/comments');

//static folder
app.use(express.static(Path.join(__dirname, 'images')));
app.use(express.static(Path.join(__dirname, 'public')));



//set engine
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs({ defaultLayout: 'layout' }));
app.set('views', Path.join(__dirname, 'views'));

//middle ware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(validator());
app.use(cookie());
app.use(cors());
app.use(session({
    secret: 'my secret',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 82 * 60 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// sessions

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.url = req.session.url;
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.danger = req.flash('danger');
    next();
});


// use routes
app.use('/api', api);
app.use('/users', users);
app.use('/article', comments);




app.listen(port, () => {
    console.log('server running on port ' + port);
});