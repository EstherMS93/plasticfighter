const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  cp: Number
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
