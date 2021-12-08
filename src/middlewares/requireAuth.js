const jwt= require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // Headers automatically converted to lower case, === "Bearer ajhfakfhaskdf"

  if( !authorization ) {
    return res.status(401).send( { error: 'You have to login.'} );
  }

  const token = authorization.replace('Bearer ', '');
  // extracts the token from the headers

  // if the user's token and the secret key are OK then call the next fn asychronously
  // getting the payload (first arg when jwt.sign was called in authRoutes e.g. userId)
  jwt.verify( token, 'MySecretKeyString', async ( err, payload ) => {
    if( err ) {
      return res.status(401).send( { error: 'You have to login.'} );
    }

    const { userId } = payload;

    const user = await User.findById( userId );
    // assign that user to the req object on the user property so now the req object stores that user
    req.user = user;
    // then call the next middleware fn in the chain
    next();
  });

};
