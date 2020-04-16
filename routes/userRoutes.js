const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/user-home', (req, res, next) => {
    res.render('user-home', { errorMessage: req.flash('error') });
});



module.exports = router;