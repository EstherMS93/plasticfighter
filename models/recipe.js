const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    title: String }
);



const RecipeModel = mongoose.model("recipe", recipeSchema)
module.exports = RecipeModel;