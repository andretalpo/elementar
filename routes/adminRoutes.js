const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/user', (req, res, next) => {
    res.render('user', { errorMessage: req.flash('error') });
});

router.get('/user/:username', (req, res, next) => {
    const username = req.params.username;

    User.find({ username })
        .then(user => {
            res.status(200).json(user[0]);
            console.log(user[0]);
        })
        .catch((err) => {
            throw new Error(err);
        });
})

router.put('/user/:username', async (req, res, next) => {
    const username = req.params.username;
    const { role } = req.body;

    try {

        await User.updateOne({ username }, { 'role': role });
        res.status(200).json({ message: 'OK' });
    } catch (err) {
        throw new Error(err);
    }
});


module.exports = router;