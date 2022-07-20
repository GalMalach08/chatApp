const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Signup user
const signupUser = async (user) => {
  const { name, email, password, pic } = user;
  if (!name || !email || !password) {
    throw new Error("Please enter all the fields");
  }
  const userExcists = await User.findOne({ email });
  if (userExcists) {
    throw new Error("User already exists");
  }

  const newUser = new User({
    name,
    email,
    password,
    pic,
  });
  const doc = await newUser.save();

  if (doc) return doc;
  else throw new Error("Failed to create the user");
};

// Login user
const loginUser = async (user) => {
  const { email, password } = user;
  const signinUser = await User.findOne({ email: email });
  if (signinUser && (await signinUser.matchPassword(password)))
    return signinUser;
  else throw new Error("Invalid email or password");
};

module.exports = { signupUser, loginUser };
