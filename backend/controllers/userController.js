const asyncHandler = require("express-async-handler");
const { userService } = require("../services");
const { generateToken, filterUserProps } = require("../utils/userUtils");

// Signup user
const signupUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.signupUser(req.body);
    res.status(201).send({
      user: { ...filterUserProps(user), token: generateToken(user._id) },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    res.status(201).send({
      user: { ...filterUserProps(user), token: generateToken(user._id) },
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Search user
const searchUser = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search || "";
    const users = await userService.searchUser(keyword, req.user._id);
    res.status(201).send({
      users: users.map((user) => filterUserProps(user)),
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = { signupUser, loginUser, searchUser };
