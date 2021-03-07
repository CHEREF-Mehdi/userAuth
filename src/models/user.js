const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  role: { type:Number, enum:[1,2], default:2, required: true },
});

userSchema.pre("save", async function (next) {
  const user = this;
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
