const express = require('express');
const router = express.Router();
const News = require('../models/News');

/* GET home page */
router.get('/', (req, res, next) => {
  const { error } = req.query;

  if (req.user) {
    res.redirect('/user-home');
    return;
  }
  res.render('index', { errorMessage: error });
});

router.get('/news', async (req, res) => {
  const { newsUrl } = req.query;
  const { user } = req;

  const emptyField = "Preencha a url da notícia.";
  const notFound = "Notícia não cadastrada";
  
  if (!newsUrl) {
    res.redirect(user ? `/user-home?error=${emptyField}` : `/?error=${emptyField}`);
    return;
  }

  try {
    const news = await News.find({ newsUrl });
    if (!news[0]) {
      res.redirect(user ? `/user-home?error=${notFound}` : `/?error=${notFound}`);
      return;
    }

    res.render('news', { news: news[0] });
  } catch (err) {
    throw new Error(err);
  }

});

module.exports = router;
