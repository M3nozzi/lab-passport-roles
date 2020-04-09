const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User.model')
const ensureLogin = require('connect-ensure-login')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res) => res.render('index'));

module.exports = router;


//LOGIN ROUTE GET

router.get('/login', (req, res) => {
    
    return res.render('auth/login', {
        errorMessage: req.flash('error')
    });
}); //closes router.get



//LOGIN ROUTE POST

router.post('/login', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true,
    passReqtoCallback: true
})

); //closes router.post


//LOGOUT

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');

})



module.exports = router;