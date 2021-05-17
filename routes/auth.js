const express = require("express");
const router = express.Router();
const UserModel = require("./../models/user");

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

router.post("/signup",  async (req, res, next) => {
    console.log(req.body)
  try {
    const newUser = { ...req.body }; // clone req.body with spread operator
    const foundUser = await UserModel.findOne({email: newUser.email });

    if (foundUser) {
      res.redirect("/signup");
    } else {

      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      res.redirect("/index");
    }
  } catch (err) {
    let errorMessage = "";
    for (field in err.errors) {
      errorMessage += err.errors[field].message + "\n";
    }
    res.redirect("/auth/signup");
  }
});


module.exports = router;
