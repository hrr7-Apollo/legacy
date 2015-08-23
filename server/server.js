var express = require('express');
var path = require('path');
var pathParse = require('path-parse'); // polyfill for older Node versions
var favicon = require('serve-favicon');
var members = require('./memberController');
var bills = require('./billController');
var utils = require('./utilController');
var mongoose = require('mongoose');
var _ = require('underscore');
var now = require("performance-now");

///////////
// CONFIG
///////////
// DB_URI enviroment variable contains mongoLab url for production server
DB_URI = process.env.DB_URI || 'mongodb://localhost/legacy';
mongoose.connect(DB_URI);
var db = mongoose.connection;

// Log database connection errors
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongo DB connection is open");
});

///////////
// MODELS
///////////
var MemberEntry = require('./db_schema/memberEntryModel.js');
var MemberProfile = require('./db_schema/memberProfileModel.js');
var MemberVote = require('./db_schema/memberVoteModel.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/../public"));
app.use(favicon(__dirname + '/../client/favicon.ico'));

/* memberList will eventually look like this after initial API call resolves
  { id1: {memberEntry},
    id2: {memberEntry},
    id3: {memberEntry},
    id4: {memberEntry},
    id5: {memberEntry}, ...
  }
*/
var memberList = {};

// storage for recently searched congressmen
var trendingList = [];

/*  memberProfile will eventually look like this after a GET request to a member_ID
  {
    id: 412669,
    name: 'Sen. Mike Rounds [R-SD]',
    description: 'Junior Senator from South Dakota',
    party: 'Republican',
    birthday: '1954-10-24',
    enddate: '2021-01-03',
    twitterid: 'SenatorRounds',
    youtubeid: null,
    website: 'http://www.rounds.senate.gov',
    phone: '202-224-5842'
  }
*/
var memberProfile = {};


/* billInfo will look like this after a GET request to a specific bill_ID
  {
    question: 'Cloture on S. 1881: A bill to prohibit Federal funding of Planned Parenthood Federation of America.',
    thomas_link: undefined,
    current_status: undefined,
    question_details: 'On Cloture on the Motion to Proceed in the Senate',
    total_minus: 46,
    total_other: 1,
    total_plus: 53,
    created: '2015-08-03T17:36:00',
    margin: 0.0707071,
    vote_type: 'On the Cloture Motion'
  }
*/
var billInfo = {};

// Set up routing to listen for GET requests from front-end

// on a GET request to '/members/*' we see if it is a call for all members or a specific member
app.get('/members/*', function(req, res){
  var pathObj = pathParse(req.url);
  // if call for historic votes, send back votes for politician to populate D3 graph of votes
  if (pathObj.dir === '/members/historic') {
    var member_id = Number(pathObj.base);
    // We are not formatting the returned object
    members.getMemberHistoricVotes(member_id, function(listing){
      // console.log('LISTING:', listing);
      res.send(listing);
    });
  }
  // if call for all, send back JSON of memberList and trendingListcreated on server start
  else if (pathObj.base === 'all') {

    res.send({memberList: memberList, trendingList: trendingList});
  } else { // we are depending on the base being a valid member_id if it is not 'all'
    var member_id = Number(pathObj.base);
    //new code
    var query = {id: member_id};

    utils.cacheOnDB(MemberProfile, query, function(foundMember){
      var start = now();
      // console.log('DB-callback', foundMember);
      utils.addMembersToTrendingList(member_id, memberList, trendingList);
      res.send(foundMember[0]);
      var end = now();
      console.log('DB Time: ', (end - start).toFixed(5));
    },function(){
      var start = now();
      console.log('API-callback');

      members.getMember(member_id, function(listing){ // use callback in getMember() to populate the memberProfile object
        // (also, add this congressman to the trending list)
      memberProfile = new MemberProfile();
        var profileProperties  = utils.makeMemberProfile(listing);
        _.extend(memberProfile, profileProperties);
        // console.log(memberProfile);
        memberProfile.save(function(err) {
          if (err) {
            console.log('ERROR:', err);
            res.send(err);
          }
          res.json(memberProfile);
        })

        utils.addMembersToTrendingList(member_id, memberList, trendingList);
        console.log(memberProfile);
        res.send(memberProfile); // send back just the profile for that member
      });
      var end = now()
      console.log('API Time: ', (end - start).toFixed(5));
    }, db);




    //old code vv
    // members.getMember(member_id, function(listing){ // use callback in getMember() to populate the memberProfile object
    //   // (also, add this congressman to the trending list)
    //   utils.addMembersToTrendingList(member_id, memberList, trendingList);
    //   memberProfile = utils.makeMemberProfile(listing);
    //   console.log(memberProfile);
    //   res.send(memberProfile); // send back just the profile for that member
    // });
  }
});

// on a GET request to 'votes/*', we are counting on the * to be a valid number for a member_ID
// we use path to parse out the base of the url which will be the member_ID as a string
// sends back memberVotes JSON to client

/* memberVotes will look like this after a GET request to a specific member's voting record
  [
     { id: ID
      vote: STRING_OF_VOTE,
      bill_question: STRING_OF_QUESTION,
      bill_question_details: STRING_OF_DETAILS,
      result: STRING_OF_RESULT
    },
    {  ...
     },
  ]
*/

app.get('/votes/*', function(req, res){

  var pathObj = pathParse(req.url);
  var member_id = Number(pathObj.base);


  var query = {id: member_id};
  utils.cacheOnDB(MemberVote, query, function(foundVotes){
    var start = now();
    // console.log(foundVotes[0].votes);
    res.send(foundVotes[0].votes);
    var end = now();
    console.log('DB Time: ', (end - start).toFixed(5));
  }, function(){
    var start = now();
    members.getMemberVotes(member_id, function(objects){

      var memberVotes = [];
      objects.forEach(function(listing){
        memberVotes.push(utils.makeVoteInfo(listing));
      });

      memberVote = new MemberVote();
      memberVote.id = member_id;
      memberVote.votes = memberVotes;

      memberVote.save(function(err) {
        if (err) {
          console.log('ERROR:', err);
          res.send(err);
        }
        res.json(memberVote);
      })

      // console.log(memberVote);
      res.send(memberVote.votes);
      var end = now();
      console.log('API Time: ', (end - start).toFixed(5));
    });


  }, db);


});










// on a GET request to 'bills/*', we are counting on the * to be a valid number for a bill_ID
// we use path to parse out the base of the url which will be the bill_ID as a string
app.get('/bills/*', function(req, res){

  var pathObj = pathParse(req.url);
  var bill_id = Number(pathObj.base);
  bills.getBillInformation(bill_id, function(listing){ // populates billInfo object with bill data
    billInfo = utils.makeBillInfo(listing);
    res.send(billInfo); // sends back JSON object to client
  });
});

app.get('/*', function(req, res){
  res.render('index.ejs');
});

// this expression runs on server start, retrieves a list of current members and writes it to memberList
// Check if we have members data on the db (stretch: how old is that data)
// TODO: stretch - check how old is the data stored on DB, and reseed from trckgov if necessary.
utils.cacheOnDB(MemberEntry, {}, function(foundMembers){
  var start = now();
  memberList = _.reduce(foundMembers, function(accumulator, current){
    accumulator[current.id] = current;
    return accumulator;
  }, {});
  // console.log('MEMBER LIST:', memberList);
  utils.addMembersToTrendingList(null, memberList, trendingList);
  console.log('Trending List ', trendingList);
  var end = now();
  console.log('DB Time: ', (end - start).toFixed(5));
}, function(){
  members.getAllMembers(function(objects){
    var start = now();
    objects.forEach(function(listing){
      var id = listing.person.id;
      memberList[id] = utils.makeMemberEntry(listing);
      var memberProperties = utils.makeMemberEntry(listing);

      var memberEntry = new MemberEntry();
      _.extend(memberEntry, memberProperties);

      memberEntry.save(function(err) {
        if (err) {
          // console.log('ERROR:', err);
          res.send(err);
        }
        // res.json(memberEntry);
      });

    });
    // console.log('MEMBER LIST:', memberList);
    utils.addMembersToTrendingList(null, memberList, trendingList);
    // console.log('Trending List ', trendingList);
    var end = now();
    console.log('API Time: ', (end - start).toFixed(5));
  });
}, db);




module.exports = app;
