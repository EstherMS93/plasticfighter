var express = require("express");
var router = express.Router();
var router = new express.Router();
var recipeModel = require("./../models/recipe");

router.get('/recipe-add', function(req, res, next) {
    res.render('recipes/recipe-add');
  });

router.post("/recipe-add", async (req, res, next) => {
  const newRecipe = { ...req.body };
  try {
    await recipeModel.create(newRecipe);
    res.redirect("/recipes");
  } catch (error) {
    next(error);
  }
});
module.exports = router;


