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
        {username}, 'access', {expiresIn: 60 * 60}
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
  if (!req.session.authorization) {
    return res.status(401).send('Please login first!');
  }

  const username = req.session.authorization.username;
  const isbn = parseInt(req.params.isbn);
  const review = req.body.review;

  const totalBook = Object.values(books).length;
  if (isbn > 0 && isbn <= totalBook) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: `Review added by ${username}` });
  }
  return res.status(400).json({ message: "Invalid ISBN" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(401).send('Please login first!');
  }

  const username = req.session.authorization.username;
  const isbn = parseInt(req.params.isbn);

  const totalBook = Object.values(books).length;
  if (isbn > 0 && isbn <= totalBook) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review deleted by ${username}` });
  }
  return res.status(400).json({ message: "Invalid ISBN" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
