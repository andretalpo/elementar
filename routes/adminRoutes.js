const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/user', (req, res, next) => {
    res.render('user', { errorMessage: req.flash('error') });
});

router.get('/user/:username', async (req, res, next) => {
    const username = req.params.username;

    try {
        const user = await User.find({ username })
        res.status(200).json(user[0]);
    } catch (err) {
        throw new Error(err);
    }
})

router.put('/user/:username', async (req, res, next) => {
    const username = req.params.username;
    const { role } = req.body;

    try {
        await User.updateOne({ username }, { 'role': role });
        res.status(200).json({ message: 'Usuário alterado com sucesso.' });
    } catch (err) {
        throw new Error(err);
    }
});

router.delete('/user/:username', async (req, res, next) => {
    const username = req.params.username;
    try {
        await User.deleteOne({ username });
        res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = router;