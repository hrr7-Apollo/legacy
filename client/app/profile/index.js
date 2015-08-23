var angular = require("angular");

var profileController = require("./profileController.js");
var Home = require('../home/homeFactory.js');

module.exports = angular.module("congressmanprofile.profile", [])
  .controller('profileController', profileController)
  .factory('Home', Home);
