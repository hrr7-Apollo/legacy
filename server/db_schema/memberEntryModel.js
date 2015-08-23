var mongoose = require('mongoose');

var memberEntrySchema = new mongoose.Schema({
  id: {
    type: Number,
    unique:true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  title:{
    type: String
  },
  role: {
    type:String
  }
});

module.exports = mongoose.model('memberEntry', memberEntrySchema);