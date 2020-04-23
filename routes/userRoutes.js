const express = require('express');
const News = require('../models/News');

const router = express.Router();

router.get('/user-home', async (req, res, next) => {
    const { user } = req;
    const { error } = req.query;

    try {
        const news = await News.find({ creator: user._id });
        res.render('user-home', { errorMessage: error, user, news: news });
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = router;