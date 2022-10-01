const jwt = require("jsonwebtoken");
const { createTokens } = require("../jwt");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).json({ msg: "Username or Password missing" });
    } else {
      const user = await User.findOne({
        $or: [{ username: username }, { email: username }],
      });
      if (!user) {
        res.status(401).json({ msg: "Invalid Username or Email" });
      } else {
        const id = user.id;
        const dbUsername = user.username;
        const dbPassword = user.password;
        bcrypt.compare(password, dbPassword).then((match) => {
          if (!match) {
            res.status(400).json({ msg: "Invalid Password" });
          } else {
            const accessToken = createTokens(user);
            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 30 * 1000, //Expires in 30 days
              httpOnly: true, //Make your cookie safer
            });
            res.status(200).json({
              name: user.name,
              username: user.username,
              email: user.email,
              id: user._id,
              active: user.active_status,
              role: user.user_type,
              accessToken,
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const user = req.body;
  try {
    const hashed_password = await bcrypt.hash(user.password, 10);
    const new_user = await User.create({
      name: user.name,
      email: user.email,
      username: user.username,
      password: hashed_password,
    });
    res.status(201).json({ new_user });
  } catch (error) {
    console.log("Error", error);
  }
};

const changePassword = async (req, res) => {
  console.log("Change Password Reached");
};

module.exports = {
  login,
  register,
  changePassword,
};
