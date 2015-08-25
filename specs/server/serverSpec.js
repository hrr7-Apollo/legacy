var app  = require('../../server/server.js');
var members = require('../../server/memberController');
var utils = require('../../server/utilController');
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var request  = require('supertest');
var expect = chai.expect;
chai.use(sinonChai);


describe("Server", function() {

  it("responds with 200 to requests to '/'", function(done){
    request(app).get('/').expect(200, done);
  });

  it("responds to requests to '/members/all' with a members object", function(done){
    request(app).get('/members/all')
      .expect(200)
      .end(function(err, res){
        expect(res.body).to.have.property("memberList");
        expect(res.body.memberList).to.not.equal(null);
        expect(res.body).to.have.property("trendingList");
        expect(res.body.trendingList).to.not.equal(null);
        done();
      });
  });

  it("responds to requests to '/members/:id' with a member object", function(done){
    /* members.getMember will receive a congressman object form the govtrack site
    and this object will be formatted by utils.makeMemberProfile,
    so whatever utils.makeMemberProfile returns must exist in the response */
    sinon.stub(members, 'getMember', function(id, callback){callback();});
    sinon.stub(utils, 'makeMemberProfile', function(listing){return {id: 666};});
    sinon.stub(utils, 'addMembersToTrendingList');
    sinon.stub(utils, 'cacheOnDB', function(dbModel, dbQuery, dbCallBack, apiCallback, db){
      apiCallback();
    });
    request(app).get('/members/1')
      .expect(200)
      .end(function(err, res){
        console.log(res.body);
        expect(members.getMember).to.have.been.calledOnce;
        expect(res.body.id).to.eql(666);
        expect(res.body._id).to.not.eql(undefined);
        members.getMember.restore();
        utils.makeMemberProfile.restore();
        utils.addMembersToTrendingList.restore();
        done();
      });
  });

  it("responds to requests to '/votes/:id' with a memberVotes object", function(done){
    /* members.members.getMemberVotes will receive an array of congressman votes
    which will be formatted by utils.makeVoteInfo,
    so response body should be an array of whatever utils.makeVoteInfo returns */
    sinon.stub(members, 'getMemberVotes', function(id, callback){
      Promise.resolve([{}]).then(callback);
    });
    sinon.stub(utils, 'makeVoteInfo', function(){return {foo: 'bar'};});
    request(app).get('/votes/1')
      .expect(200)
      .end(function(err, res){
        expect(members.getMemberVotes).to.have.been.calledOnce;
        expect(res.body).to.eql([{foo: 'bar'}]);
        utils.makeVoteInfo.restore();
        done();
      });
    // members.getMemberVotes.restore();
    // utils.makeVoteInfo.restore();
  });

});
