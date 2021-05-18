const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("./../models/user");


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
      res.redirect("/login");
    } else {

      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      res.redirect("/");
    }
  } catch (err) {
    res.send("erreur");
  }
});

// SignIn Process //
router.get('/signin', function(req, res, next) {
  res.render('auth/login');
});

router.get('/myaccount', function(req, res, next) {
  res.render('auth/myaccount');
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
      res.redirect(`/auth/myaccount/${req.session.currentUser._id}`);
    }
  }
 
});

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


// LogOut //
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
