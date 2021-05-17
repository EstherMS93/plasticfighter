var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/recipe-add', function(req, res, next) {
  res.render('recipes/recipe-add', { title: 'Express' });
});

module.exports = router;