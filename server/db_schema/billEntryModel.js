var mongoose = require('mongoose');

var billEntrySchema = new mongoose.Schema({
  id: {
    type: Number,
    unique:true
  },
  // the bill_id is the id of the bill in the data we're receiving from the govtrack api
  bill_id: {
    type: Number,
    unique:true
  },
  // subjects is an array of keywords and phrases represented as strings
  terms: {
    type: Array
  }
});

module.exports = mongoose.model('billEntry', billEntrySchema);
