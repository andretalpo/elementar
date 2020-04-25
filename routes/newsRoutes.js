const express = require('express');
const News = require('../models/News');
const User = require('../models/User');

const router = express.Router();

router.get('/create', (req, res) => {
    res.render('create-news');
});

router.post('/create', async (req, res) => {
    const { user } = req;

    const { newsUrl, title, voteRadio } = req.body;

    const fake = voteRadio === "fake" ? 1 : 0;
    const truth = voteRadio === "truth" ? 1 : 0;

    try {
        const news = new News({ newsUrl, title, creator: user._id, votingUsers: [user._id], fakeVotes: fake, truthVotes: truth });
        await news.save();
        if (fake > 0 || truth > 0) {
            await User.updateOne({ _id: user._id }, { $push: { votedNews: [news._id] } });
        }
        res.redirect('/user-home');
    } catch (error) {
        console.log(error);
        if (error.message.includes('required')) {
            res.render('create-news', { errorMessage: 'Por favor, preencha todos os campos.' });
            return;
        }

        if (error.message.includes('newsUrl')) {
            res.render('create-news', { errorMessage: 'A url dessa notícia já foi cadastrada.' });
            return;
        }
    }
})

router.put('/:id/voteTruth', async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;

    try {
        const voted = await News.findOne({ _id: id, votingUsers: user._id });
        if (!voted) {
            await News.updateOne({ _id: id }, { $push: { votingUsers: [user._id] }, $inc: { truthVotes: 1 } });
            await User.updateOne({ _id: user._id }, { $push: { votedNews: [id] } });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(200).json({ message: 'Essa notícia já foi votada por esse usuário.' });
        }
    } catch (error) {
        throw new Error(error);
    }
});

router.put('/:id/voteFake', async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;

    try {
        const voted = await News.findOne({ _id: id, votingUsers: user._id });
        console.log(voted);
        if (!voted) {
            await News.updateOne({ _id: id }, { $push: { votingUsers: [user._id] }, $inc: { fakeVotes: 1 } });
            await User.updateOne({ _id: user._id }, { $push: { votedNews: [id] } });
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(200).json({ message: 'Essa notícia já foi votada por esse usuário.' });
        }
    } catch (error) {
        throw new Error(error);
    }
});

router.put('/spec/:id/analisys', async (req, res) => {
    const { id } = req.params;
    const { specText, sourceUrl } = req.body;
    const { user } = req;

    if (!specText || !sourceUrl) {
        res.status(200).json({ message: 'Preencha todos os campos.' });
        return;
    }

    try {
        await News.updateOne({ _id: id }, { specText, sourceUrl, spec: user._id });
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = router;