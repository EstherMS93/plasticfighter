var express = require("express");
var router = express.Router();
var router = new express.Router();
var RecipeModel = require("./../models/recipe");

// Add a recipe //
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

  // Get detail from a recipe // (ok working)
  router.get("/recipe-detail/:id", (req, res, next) => {
    RecipeModel.findById(req.params.id)
    .then((list)=>{
        res.render("recipes/recipe-detail", {
            recipe: list,
        });
    })
    .then((err)=> {
        next(err);
    })
})


// Display all recipes // Just for a test !
router.get("/allrecipes", async (req, res, next) => {
  const list = await RecipeModel.find()
  try {
    res.render("recipes/allrecipes", { recipe: list });
  } catch (err) {
    next(err);
  }
});

// Delete one recipe //
router.get("/recipe-detail/delete/:id", async (req,res)=>{
  try {
      await RecipeModel.findByIdAndRemove(req.params.id);
      res.redirect("/recipes/allrecipes");
    } catch (err) {
      next(err);
    }
  });


module.exports = router;


