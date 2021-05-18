var express = require("express");
var router = express.Router();
var router = new express.Router();
var RecipeModel = require("./../models/recipe");
const logUser = require ("./../middlewares/protectRoute")

///////////////// Add a recipe /////////////////

router.get('/recipe-add', function(req, res, next) {
  res.render('recipes/recipe-add', {style: 'recipe.css'});
});

router.post("/recipe-add", async (req, res, next) => {
  const newRecipe = { ...req.body };
  newRecipe.user = req.session.currentUser._id;
  
  try {
    await RecipeModel.create(newRecipe);
    res.redirect("/");
  } catch (err) {
    res.send("erreur");
  }
});

///////////////// Get detail from a recipe ///////////////// (ok working)
router.get("/recipe-detail/:id", (req, res, next) => {
  RecipeModel.findById(req.params.id)
    .then((list) => {
      res.render("recipes/recipe-detail", {
        recipe: list,
      });
    })
    .then((err) => {
      next(err);
    });
});

/////////////////  Display all recipes /////////////////  Just for a test !
router.get("/allrecipes/:category", async (req, res, next) => {
  const list = await RecipeModel.find({category: req.params.category});
  try {
    res.render("recipes/allrecipes", { recipe: list });
  } catch (err) {
    next(err);
  }
});


/////////////////  Edit a recipe /////////////////
router.get("/recipe-edit/:id", async (req, res, next) => {
  try {
    res.render(
      "recipes/recipe-edit",
      await RecipeModel.findById(req.params.id)
    );
  } catch (err) {
    next(err);
  }
});

router.post("/recipe-edit/:id", (req, res, next) => {
  RecipeModel.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.redirect("/recipes/allrecipes"))
    .catch(() => res.send("erreur"));
});

/////////////////  Delete one recipe /////////////////
router.get("/recipe-detail/delete/:id", async (req, res) => {
  try {
    await RecipeModel.findByIdAndRemove(req.params.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
