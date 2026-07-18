const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const totalBook = Object.values(books).length;
  if (isbn > 0 && isbn <= totalBook) {
    res.send(books[isbn]);
  }
  else {
    res.send('invalid isbn');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const filtered_books = {};

  for (let isbn in books) {
    if (books[isbn].author === author) {
        filtered_books[isbn] = books[isbn];
    }
  }

  if (Object.values(filtered_books).length > 0) {
    res.send(filtered_books);
  }
  else {
    res.send('No matching author!');
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
