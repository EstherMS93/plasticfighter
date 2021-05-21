var express = require("express");
var router = express.Router();
var router = new express.Router();
var RecipeModel = require("./../models/recipe");
var UserModel = require("./../models/user")
const logUser = require ("./../middlewares/protectRoute")
const Uploader = require ("./../config/cloudinary")


///////////////// Add a recipe /////////////////

router.get('/recipe-add', logUser, function(req, res, next) {
  res.render('recipes/recipe-add');
});

router.post("/recipe-add", logUser, Uploader.single("image"), async (req, res, next) => {
  const newRecipe = { ...req.body };
  newRecipe.user = req.session.currentUser._id;
  if (req.file) {
    newRecipe.image = req.file.secure_url;
  }
  try {
    await RecipeModel.create(newRecipe);
    res.redirect("/auth/myaccount");
  } catch (err) {
    res.send(err);
  }
});

///////////////// Get detail from a recipe ///////////////// (ok working)
router.get("/recipe-detail/:id", (req, res, next) => {
  console.log("detail", req.params.id)
  RecipeModel.findById(req.params.id).populate("user")
    .then((list) => {
      console.log(list)
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

router.post("/recipe-edit/:id", Uploader.single("image"), (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  const editRecipe = { ...req.body };
  if (req.file) {
    editRecipe.image = req.file.secure_url;
  }
  RecipeModel.findByIdAndUpdate(req.params.id, editRecipe)
    .then(() => res.redirect("/auth/myaccount"))
    .catch(() => res.send("erreur"));
});

/////////////////  Delete one recipe /////////////////
router.get("/recipe-detail/delete/:id", async (req, res) => {
  try {
    await RecipeModel.findByIdAndRemove(req.params.id);
    res.redirect("/auth/myaccount");
  } catch (err) {
    next(err);
  }
});



module.exports = router;
