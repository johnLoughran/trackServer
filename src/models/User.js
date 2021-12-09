const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// pre save hook added to salt and hash the pwd before saving it.
// using function(){ } instead of () => { } so that 'this' refers to the user object
// I omitted next as an arg in fn and got ref error: next is not defined.
userSchema.pre('save', function( next ) {
  const user = this;  // rename this as user which it is anyway

  // if the user has not changed their password do nothing, just move on to next() (Why?)
  if( !user.isModified('password') ) {
    return next();
  }

  // else, callback invoked with an error object and the hash
  bcrypt.genSalt( 7, (err, salt) => {
    if( err ) {
      return next( err );
    }
    // (else) , callback invoked with an error object and the hash
    bcrypt.hash( user.password, salt, ( err, hash ) => {
      if( err ) {
        return next( err );
      }
      // so if no errors then save the salted hash as the pwd
      user.password = hash;
      // now it is saved we move on
      next();
    });
  });
});

// create a method to compare passwords, using Promise which uses async await when called
userSchema.methods.comparePassword = function( candidatePassword ) {
  const user = this;

  return new Promise( (resolve, reject ) => {
    bcrypt.compare( candidatePassword, user.password, ( err, isMatch ) => {
      // these three clauses are equivalent to if, elseif and else
      if( err ) {
        return reject( err );
      }
      if( !isMatch ) {
        return reject( false );
      }
      // no need to add return as it is the last line anyway
      resolve( true );
    });
  });
};

// creates a mongoose model called User based on the user Schema.
// When we require this file we can use the User model.
// The model has a schema and methods attached, a bit like a class.
mongoose.model( 'User', userSchema );
