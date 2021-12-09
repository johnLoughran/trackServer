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

    await user.save(); // save user, based on User Model, to mongo db in the user Collection (like a db table)

    const token = jwt.sign( { userId: user._id }, 'MySecretKeyString' );
    res.send( { token: token } );
    // res.send('You made a post request to /signup'); // served as test text to display
  }
  catch (err) {
    // added return so that it is last thing that is done in the catch block
    return res.status(422).send( err.message );
  }
});

// Create a route to allow user to sign in (login)
// Make the callback async to allow await for db lookup
router.post('/signin', async ( req, res ) => {
  // Save the email and pwd the person input from the body property of the request object
  const { email, password } = req.body;

  // If no email or no pwd was input return early with an error and a 422 status code "Sth went wrong"
  // 401 means access forbidden
  if( !email || !password ) {
    return res.status(422).send( { error: { "You must enter your email and password."} } );
  }
  // find the user with that email, if none exists return vague error and code 401
  const user = User.findOne( { email });
  if( !user ) {
    return res.status(401).send( { error: 'Invalid username or password' } );
  }

  // (else) Try to compared the pwds (this returns early if they do not match)
  User.comparePassword( password )
  // Make a token incorporating the user's email and secret key and send it back with the response

  // If error then return with vague error and 401

});



module.exports = router;
