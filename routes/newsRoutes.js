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

router.put('/:id/voteTruth', async(req, res, next) => {
    const { id } = req.params;
    const { user } = req;

    try {
        await News.updateOne({ _id: id }, { $push: { votingUsers: [user._id] }, $inc: { truthVotes: 1 } });

        await User.updateOne({ _id: user._id }, { $push: { votedNews: [id] } });

        res.redirect('/');

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
});

module.exports = router;