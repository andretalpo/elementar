const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('login', { errorMessage: req.flash('error') });
});

router.post('/signup', async (req, res) => {
    try {
        const { name, username, password, email } = req.body;
        let hashPassword;

        if (password) {
            const saltRouds = 10;
            const salt = bcrypt.genSaltSync(saltRouds);
            hashPassword = bcrypt.hashSync(password, salt);
        }

        await new User({ name, username, password: hashPassword, email }).save();

        res.redirect('/user-home');
    } catch (error) {
        if (error.message.includes('required')) {
            res.render('login', { errorMessage: 'Por favor, preencha todos os campos.' });
            return;
        }

        if (error.message.includes('username')) {
            res.render('login', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário.' });
            return;
        }

        if (error.message.includes('email')) {
            res.render('login', { errorMessage: 'E-mail já cadastrado. Por favor insira outro e-mail.' });
            return;
        }
    }
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/user-home',
        failureRedirect: '/auth/login',
        failureFlash: true,
        passReqToCallback: true
    })
);

// faccebook strategy login
router.get('/login/facebook', passport.authenticate('facebook'));

router.get(
    '/facebook/callback',
    passport.authenticate(
        'facebook',
        { failureRedirect: '/login' }
    ),
    (req, res) => {
        res.redirect('/user-home');
    },
);

// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
})

router.get('/authenticated', (req, res) => {
    const { user } = req;
    let role;
    if (user) role = user.role;
    res.status(200).json({ authenticated: req.isAuthenticated(), role});
});

module.exports = router;