const express = require('express');
const News = require('../models/News');

const router = express.Router();

router.get('/create', (req, res) => {
    res.render('create-news');
});

router.post('/create', async (req, res) => {
    const { user } = req;

    const { newsUrl, title, voteRadio } = req.body;
    
    const fake = voteRadio === "fake" ? 1 : 0;
    const truth =  voteRadio === "truth" ? 1 : 0;

    try {
        await new News({ newsUrl, title, creator: user._id, votingUsers: [user._id], fakeVotes: fake, truthVotes: truth }).save();
        //salvar noticia no usuario
        res.redirect('/user-home');
    } catch (error) {
        // if (error.message.includes('required')) {
        //     res.render('login', { errorMessage: 'Por favor, preencha todos os campos.' });
        //     return;
        // }

        // if (error.message.includes('username')) {
        //     res.render('login', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário.' });
        //     return;
        // }

        // if (error.message.includes('email')) {
        //     res.render('login', { errorMessage: 'E-mail já cadastrado. Por favor insira outro e-mail.' });
        //     return;
        // }
    }
})

module.exports = router;