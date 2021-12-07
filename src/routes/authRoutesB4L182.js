const express = require('express');
// to use the User schema:
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

// Cannot test in browser using localhost:3001/signup as this would be a get request.
// Use Postman instead to test post requests.
router.post('/signup', (req, res) => {
  // body is part of req, parsed by body-parser
  console.log( 'The req.body is ', req.body );

  res.send('You made a post request to /signup');
});

module.exports = router;
