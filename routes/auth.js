var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

module.exports = router;