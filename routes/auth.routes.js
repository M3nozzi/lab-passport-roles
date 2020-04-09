const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const ensureLogin = require('connect-ensure-login')

// add routes here

//protected route
router.get("/main", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("main", { user: req.user });
  });
module.exports = router;
