const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password missing
  if (!username || !password) {
    return res.send('Error login in: You need to give both username and password');
  }

  if (authenticatedUser(username, password)) {
    // generate JWT access token
    let accessToken = jwt.sign(
        {data: password}, 'access', {expiresIn: 60 * 60}
    );

    // store access token in session
    req.session.authorization = {
        accessToken, username
    }
    return res.send("User successfully logged in");
  }
  else {
    return res.send("Invalid Login. Check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
