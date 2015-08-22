var mongoose = require('mongoose');

var billEntrySchema = new mongoose.Schema({
  // the apiId is the id of the bill in the data we're receiving from the govtrack api
  apiId: {
    type: Number,
    unique:true
  },
  // subjects is an array of keywords and phrases represented as strings
  subjects: {
    type: Array
  }
});

module.exports = mongoose.model('billEntry', billEntrySchema);
