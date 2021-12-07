const express = require('express');
// to use the User schema:
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

// Cannot test in browser using localhost:3001/signup as this would be a get request.
// Use Postman instead to test post requests.
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  // body is part of req, parsed by body-parser in index.js
  // console.log( 'The req.body is ', req.body );

  const user = new User({ email, password });

  await user.save(); // save user, based on User Model to mongo db in the User Collection (like a db table)


  res.send('You made a post request to /signup');
});

module.exports = router;
