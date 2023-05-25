const userDB = {
  users: require("../models/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const fsPromise = require("fs/promises");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);

  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    procces.env.REFRESH_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return;
      res.sendStatus(403);
      const accessToken = jwt.sign(
        { "username": decoded.username },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = handleRefreshToken;
