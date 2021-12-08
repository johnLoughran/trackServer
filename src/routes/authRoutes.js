const express = require('express');
// to use the User schema:
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const router = express.Router();

// Cannot test in browser using localhost:3001/signup as this would be a get request.
// Use Postman instead to test post requests.
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  // body is part of req, parsed by body-parser in index.js
  // console.log( 'The req.body is ', req.body );

  try {
    const user = new User({ email, password });

    await user.save(); // save user, based on User Model to mongo db in the User Collection (like a db table)

    const token = jwt.sign( { userId: user._id }, 'MySecretKeyString' );
    res.send( { token: token } );
    // res.send('You made a post request to /signup');
  }
  catch (err) {
    // added return so that it is last thing that is done in the catch block
    return res.status(422).send( err.message );
  }
});

module.exports = router;
