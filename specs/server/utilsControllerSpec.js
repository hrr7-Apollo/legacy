var utils = require('../../server/utilController');
var fixtures = require('./fixtures');
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var request  = require('supertest');
var expect = chai.expect;
chai.use(sinonChai);

describe("Utils controller", function() {

  describe("makeMemberProfile function", function() {

    // this is an example of a real object returned by govtrack api
    var responseFromGovTrack = fixtures.congressMemberFromGovtrack;

    // this is the object we expect to build out of the previous one
    var memberProfile = {
      id: 412669,
      firstname: 'Mike',
      lastname: 'Rounds',
      fullname: 'Sen. Mike Rounds [R-SD]',
      description: 'Junior Senator from South Dakota',
      party: 'Republican',
      role: 'senator',
      birthday: '1954-10-24',
      enddate: '2021-01-03',
      twitterid: 'SenatorRounds',
      youtubeid: null,
      website: 'http://www.rounds.senate.gov',
      phone: '202-224-5842'
    };

    xit("correctly builds member profile out of the govtrack api response object", function(){
      expect(utils.makeMemberProfile(responseFromGovTrack)).to.eql(memberProfile);
    });

  });


  describe("makeVoteInfo function", function() {

    // this is an example of response by govtrack api
    var responseFromGovTrack = fixtures.memberVoteFromGovtrack;

    var memberVoteInfo = {
      id: 116144,
      link: 'https://www.govtrack.us/congress/votes/114-2015/s4',
      vote: 'Yea',
      bill_question: 'On the Motion to Table S.Amdt. 13 to S.Amdt. 2 to S. 1 (Keystone XL Pipeline Act)',
      bill_question_details: null,
      result: 'Motion to Table Agreed to'
    };

    it("correctly builds vote info object out of the govtrack api response object", function(){
      expect(utils.makeVoteInfo(responseFromGovTrack)).to.eql(memberVoteInfo);
    });

  });


  /*
    addMembersToTrendingList may not be properly testable
    (at least the first 'it' is not),
    because when Mocha loads server.js, the code of this file gets executed,
    the function members.getAllMembers runs, and at any moment I can get response
    with the real members object from the govtrack api
  */

  describe("addMembersToTrendingList function", function() {
    var members =  {
      1: {id: 1, value: 'foo'},
      2: {id: 2, value: 'bar'},
      3: {id: 3, value: 'baz'},
      4: {id: 4, value: 'qux'},
      5: {id: 5, value: 'fizz'},
      6: {id: 6, value: 'buzz'},
      7: {id: 7, value: 'ping'},
      8: {id: 8, value: 'pong'},
      9: {id: 9, value: 'bla'}
    };
    var trendingList;

    xit("puts 8 congressmen into the trending list if congressman's id is not provided", function(){
      trendingList = [];
      utils.addMembersToTrendingList(null, members, trendingList);
      expect(trendingList.length).to.equal(8);
    });


    describe("when congressman's id is provided", function(){
      // when congressman's id is provided, it means, the initial trendingList array has already been created

      beforeEach(function() {
        trendingList = [{id: 1, value: 'foo'}, {id: 2, value: 'bar'}, {id: 3, value: 'baz'}];
      });

      xit("if congressman with this id is not in trending list, removes the last member of the list and puts the congressman on the first place of the list", function(){
        utils.addMembersToTrendingList(4, members, trendingList);
        expect(trendingList[0].id).to.equal(4);
      });

      it("if congressman with this id is present in the trending list, does not modify the list", function(){
        var initialTrendingList = Array.prototype.slice.call(trendingList);
        utils.addMembersToTrendingList(3, members, trendingList);
        expect(trendingList).to.eql(initialTrendingList);
      });

    });

  });


});

