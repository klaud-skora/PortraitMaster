const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model');

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  
  try {
    const user = await Voter.findOne({ user: req.clientIp });

    if(user) {
      const voterToUpdate = await Voter.findOne({ $and: [{ user: req.clientIp }, { votes: req.params.id } ] });

      if(!voterToUpdate) {
        await Voter.updateOne( { user: req.clientIp }, { $push: { votes: [req.params.id] } } );
      } else {
        throw new Error('Already voted!')
      }

    }

    if(!user) {
      const newVoter = new Voter({ user: req.clientIp, votes: [req.params.id]});
      await newVoter.save();
    }
    
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });
    else {
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: 'OK' });
    }
  } catch(err) {
    res.status(500).json(err);
  }

};