const jwt = require("jsonwebtoken");

// Generate authentication token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Filter the user props that gets returned to the frontend
const filterUserProps = (user) => {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    pic: user.pic,
  };
};

module.exports = { filterUserProps, generateToken };
