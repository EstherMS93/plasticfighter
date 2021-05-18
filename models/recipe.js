const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    title: String,
    type: { type: String, enum: ["recette", "tip"] },
    category: {
      type: String,
      enum: ["maison", "cheveux", "visage", "hygiene"],
    },
    ingredients: String,
    description: String,
    // rating: Number,
    duration: Number,
    level: { type: String, enum: ["facile", "modéré", "difficile"] },
    price: { type: String, enum: ["bon marché", "modéré", "coûteux"] },
    image: {
      type: String,
      default: "/images/testimage.png",
    },
    user: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const RecipeModel = mongoose.model("recipe", recipeSchema);
module.exports = RecipeModel;
