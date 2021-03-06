const express = require('express');
// const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')

const app = express();

// Enable this file (or the express object 'app') to use routes defined in authRoutes.js
//app.use('authRoutes');

// I got the connection uri from cluod.mongodb.com, edit cluster0, connect
// I had to replace <password> joxF3h6ovuBcvmYp
// const uri = "mongodb+srv://johnLoughran:<password>@cluster0.97bh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoUri = "mongodb+srv://johnLoughran:joxF3h6ovuBcvmYp@cluster0.97bh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoUri); // not (mongUri, { useNewUrlParser:true etc. }), used in < v6
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo instance', err);
});

app.get('/', (req, res) => {
  res.send('Hi from index.js');
});

// changed to port 3001 as port 3000 was in use, err msg, then it worked.
app.listen( 3000, () => {
  console.log( "App is Listening on port 3000");
});
