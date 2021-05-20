const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("./../models/user");
const logUser = require ("./../middlewares/protectRoute")
const RecipeModel = require ("./../models/recipe")

// redirection //
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

// SignUP process //
router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

router.post("/signup",  async (req, res, next) => {
    console.log(req.body)
  try {
    const newUser = { ...req.body }; // clone req.body with spread operator
    const foundUser = await UserModel.findOne({email: newUser.email });

    if (foundUser) {
      res.redirect("/auth/login");
    } else {

      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      res.redirect("/auth/login");
    }
  } catch (err) {
    res.send("erreur");
  }
});

// SignIn Process //
router.get('/signin', function(req, res, next) {
  res.render('auth/login');
});

router.get('/myaccount', logUser, function(req, res, next) {
  RecipeModel.find({user: req.session.currentUser._id})
  .then(userRecipes => {
    res.render('auth/myaccount', {user: req.session.currentUser, recipes: userRecipes});
  })
});

router.post("/signin", async (req, res, next) => {
  console.log(req.body)
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email: email });
  if (!foundUser) {
    res.send("you must create an account");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      res.send("wrong password");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password; 
      req.session.currentUser = userObject;
      res.redirect("/auth/myaccount");
    }
  }
 
});

/*
/// get detail from a user ///
router.get("/myaccount/:id", (req, res, next) => {
  UserModel.findById(req.params.id)
  .then((list)=>{
      res.render("auth/myaccount", {
          user: list,
      });
  })
  .then((err)=> {
      next(err);
  })
})
*/

router.get("/editmyaccount/:id", async (req, res, next) => {
  try {
    res.render(
      "auth/editmyaccount",
      await UserModel.findById(req.params.id)
    );
  } catch (err) {
    next(err);
  }
});

router.post("/editmyaccount/:id", (req, res, next) => {
  UserModel.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.redirect("/"))
    .catch(() => res.send("erreur"));
});

//////////// Render all recipes from a user ////////////



// LogOut //
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
