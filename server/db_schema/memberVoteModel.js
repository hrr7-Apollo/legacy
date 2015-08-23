var mongoose = require('mongoose');

var memberVoteSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique:true
  },
  votes: {
    type: Array
  }
});

module.exports = mongoose.model('memberVote', memberVoteSchema);

// id: listing.vote.id,
// link: listing.vote.link,
// vote: listing.option.value,
// bill_question: listing.vote.question,
// bill_question_details: listing.vote.question_details,\
// result: listing.vote.result



