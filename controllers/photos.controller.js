const Photo = require('../models/photo.model');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if(title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];
      const pattern = new RegExp(/((\w|\s|\.)*)/, 'g');
      const authorMatched = author.match(pattern).join('');
      const titleMatched = title.match(pattern).join('');
      const emailPattern = new RegExp(/((\w|\.)*)/, 'g');
      const emailMatched = email.match(emailPattern).join('');

      if(fileExt !== 'gif' && fileExt !== 'jpg' && fileExt !== 'png') {
        throw new Error('Wrong file!')
      }

      if(title.length > 25) {
        throw new Error('Title is too long');
      }

      if(author.length > 50) {
        throw new Error('Author\'s name is too long');
      }

      
      if(authorMatched.length < author.length || titleMatched.length < title.length) {
        throw new Error('Invalid characters...');
      } 

      if(email.indexOf('@') === -1 || emailMatched.length < email.length -1 ) {
        throw new Error('Invalid characters...');
      } 

      const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
      await newPhoto.save(); // ...save new photo in DB
      res.json(newPhoto);

    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};
