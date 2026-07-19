const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username == username;
    })

    // Return true if any user with the same username is found
    if (userswithsamename.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if both username and password are provided
  if (username && password) {
    if (!doesExist(username)) {
        users.push({'username': username, 'password': password});
        return res.send('User successfully registered. Now you can login');
    }
    else {
        return res.send('Unable to register user: Username already exists');
    }
  }
  else {
    return res.send('Unable to register user: You must provide both username and password');
  }
});

// Get the book list available in the shop

public_users.get('/', async (req, res) => {
  try {
    const bookList = await Promise.resolve(books);
    res.status(200).json(bookList);
  }
  catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn);
    const totalBook = Object.values(books).length;
    if (isbn > 0 && isbn <= totalBook) {
      const book = await Promise.resolve(books[isbn]);
      return res.status(200).json(book);
    }
    return res.status(400).json({message: 'invalid isbn'});
  }
  catch (err) {
    return res.status(500).json({message: err.message});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  try {
    const author = req.params.author;
    const filtered_books = {};
    const bookList = await Promise.resolve(books);
    for (let isbn in books) {
      if (bookList[isbn].author === author) {
          filtered_books[isbn] = books[isbn];
      }
    }
    if (Object.values(filtered_books).length > 0) {
      return res.status(200).json(filtered_books);
    }
    return res.status(400).json({message: 'No matching author!'});
  }
  catch (err) {
    return res.status(500).json({message: err.message})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const filtered_books = {};

  for (let isbn in books) {
    if (books[isbn].title === title) {
        filtered_books[isbn] = books[isbn];
    }
  }

  if (Object.values(filtered_books).length > 0) {
    res.send(filtered_books);
  }
  else {
    res.send('No matching title!');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const totalBook = Object.values(books).length;
    if (isbn > 0 && isbn <= totalBook) {
      res.send(books[isbn].reviews);
    }
    else {
      res.send('invalid isbn');
    }
});

module.exports.general = public_users;
