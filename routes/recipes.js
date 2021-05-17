var express = require("express");
var router = express.Router();
var router = new express.Router();
var RecipeModel = require("./../models/recipe");

router.get('/recipe-add', function(req, res, next) {
    res.render('recipes/recipe-add');
  });

  router.post("/recipe-add", async (req, res, next) => {
    const newRecipe = { ...req.body };
    console.log(req.body)
    try {
      await RecipeModel.create(newRecipe);
      res.redirect("/");
    } catch (err) {
        res.send("erreur");
    }
  });


module.exports = router;


