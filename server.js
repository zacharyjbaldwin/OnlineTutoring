const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require("passport");
const chalk = require('chalk');

const PORT = process.env.PORT || 5000;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || require('./config.json').MONGO_DB_CONNECTION_STRING;

let app = express(); // initialize express
app.use(express.json()); // this allows express to parse the contents of request bodies
app.use(morgan('dev')); // this logs all requests to the console (good for debugging)
app.use(express.urlencoded({
    extended: false
})
);
app.use(express.json());

// allow the www folder to be publicly accessed
app.use(express.static(path.join(__dirname, 'www')));

// cors settings, which allow the frontend to make requests to this backend. DO NOT MODIFY
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

// register your routes here
app.use('/api/users', require('./api/routes/users.routes'));
app.use('/api/tutors', require('./api/routes/tutors.routes'));
app.use('/api/favorites', require('./api/routes/favorites.routes'));
app.use('/api', require('./api/routes/helloworld.routes'));
app.use('/api/register', require('./api/routes/register.routes'));
app.use('/api/login', require('./api/routes/login.routes'));
app.use('/api/appointments', require('./api/routes/appointments.routes'));

// serve the frontend application if no routes match
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./keys/passport.js")(passport);

// listen for requests
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_DB_CONNECTION_STRING)
    .then(() => {
        app.listen(PORT, () => {
            console.log(chalk.yellow(`GO TO http://localhost:${PORT} IN YOUR BROWSER`));
        });
    })
    .catch(() => {
        console.log('Failed to connect to MongoDB.');
        process.exit(1);
    });

