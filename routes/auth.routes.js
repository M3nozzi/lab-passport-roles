const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');


function checkRoles(role1, role2, role3) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role1) {
        return next();
      } else if (req.isAuthenticated() && req.user.role === role2) {
        return next();
      } else if (req.isAuthenticated() && req.user.role === role3) {
        return next();
      } else {
        res.redirect('/auth/login')
      }
    }
}

router.get('/', checkRoles('BOSS'), (req, res, next) => {
    res.render('employee/add')
})

router.post('/employee', passport.authenticate('local', {
    successRedirect: '/main',
    failureRediect: '/auth/login'
}))

router.get('/list', checkRoles('BOSS'), (req, res, next) => {
    User.find()
    .then(users => {
        res.render('employee/list', { users })
    })
})

router.get('/info', checkRoles('DEV', 'TA', 'GUEST'), (req, res, next) => {
    User.find()
    .then(users => {
        res.render('employee/info', { users })
    })
})

router.get('/edit/:id', checkRoles('BOSS'), (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        res.render('employee/info', user)
    })
})

router.get('/edit', checkRoles('DEV', 'TA', 'GUEST'), (req, res, next) => {
    res.render('employee/edit', req.user)
    console.log(req.user.id)
})

router.get('/edit-user/:id', checkRoles('DEV', 'TA', 'GUEST'), (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        res.render('employee/info', user)
    })
})

router.post('/info/:id', checkRoles('BOSS'), (req, res, next) => {
    User.updateOne({_id:req.params.id}, {role:req.body.role})
    .then(() => {
        res.redirect('/employee/list')
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/edit/:id', checkRoles('DEV', 'TA', 'GUEST'), (req, res, next) => {
    User.updateOne({_id:req.params.id}, {role:req.body.role})
    .then(() => {
        res.redirect('/employee/info')
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/add', checkRoles('BOSS'), (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
    User.create({
      username: req.body.username,
      password: hash,
      role: req.body.role
      })
    .then((user) => {
        res.send(user)
    })
    .catch(e => {
        console.log(e)
    })
    })
})

router.get('/delete/:id', checkRoles('BOSS'), (req, res, next) => {
    User.deleteOne({_id:req.params.id})
    .then(() => {
        res.redirect('/employee/list')
    })
    .catch(e => {
        console.log(e)
    })
})




module.exports = router;
