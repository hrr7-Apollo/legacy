var mongoose = require('mongoose');

var memberProfileSchema = new mongoose.Schema({
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
  fullName: {
    type: String
  },
  description: {
    type: String
  },
  party: {
    type:String
  },
  role: {
    type: String
  },
  birthday: {
    type:String
  },
  enddate: {
    type:String
  },
  twitterid: {
    type:String
  },
  youtubeid: {
    type:String
  },
  website: {
    type:String
  },
  phone: {
    type:String
  }
});

module.exports = mongoose.model('memberProfile', memberProfileSchema);

// { id: 300081,
//   firstname: 'John',
//   lastname: 'Reed',
//   fullname: 'Sen. John “Jack” Reed [D-RI]',
//   description: 'Senior Senator from Rhode Island',
//   party: 'Democrat',
//   role: 'senator',
//   birthday: '1949-11-12',
//   enddate: '2021-01-03',
//   twitterid: 'SenJackReed',
//   youtubeid: 'SenatorReed',
//   website: 'http://www.reed.senate.gov',
//   phone: '202-224-4642' }



