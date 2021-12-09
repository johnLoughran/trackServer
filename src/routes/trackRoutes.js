// require mongoose, express, requireAuth
// need to call this once in index.js to make a Track
const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();
router.use(requireAuth);

// get a list of all tracks (from the /tracks route)
// stored by that user in db and send it in the response
// Left out await, got circular JSON error
router.get('/tracks', async (req, res) => {
  const tracks = await Track.find( { userId: req.user._id });

  res.send( tracks );
});

// allow saving of a track, assuming phone sends us the data in the expected format
router.post('/tracks', async (req, res) => {
  // store the name and locations array from the request bodyParser
  const { name, locations } = req.body;

  // if these are false then return with error
  if( !name || !locations ) {
    return res.status(422).send( { error: "Need to supply track name and locations"});
  }
  // mongoose checks e.g. that locations is an array of objects

  // If all is ok, try to make a new track from the name and locations and userid from the req
  try {
    const track = new Track( { name, locations, userId: req.user._id });
    // then save it and send it
    await track.save();
    res.send( track );
  }
  catch (err) {
    // not best in prodn to send back error msg
    res.status(422).send( { error: err.message });
  }
});

// export that router when this file is required
module.exports = router;

// JSON object for test send post request to localhost:3000/tracks in Postman
// {
//   "name": "New track test",
//   "locations": [
//     {
//       "timestamp": 1639063352,
//       "coords": {
//         "latitude": 50,
//         "longitude": 55,
//         "altitude": 10,
//         "accuracy": 10,
//         "heading": 10,
//         "speed": 10
//       }
//     }
//   ]
// }

// Postman returns the JSON including ids etc.
// {
//     "userId": "61b1f37b5b35ff4aadefab35",
//     "name": "New track test",
//     "locations": [
//         {
//             "timestamp": 1639063352,
//             "coords": {
//                 "latitude": 50,
//                 "longitude": 55,
//                 "altitude": 10,
//                 "accuracy": 10,
//                 "heading": 10,
//                 "speed": 10
//             },
//             "_id": "61b225bb238c6da0fdf37063"
//         }
//     ],
//     "_id": "61b225bb238c6da0fdf37062",
//     "__v": 0
// }
