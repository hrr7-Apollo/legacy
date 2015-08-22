//Home Controller


var Raphael = require('Raphael');
var usmap = require('usmap');
var Home = require('./homeFactory.js');

module.exports = function homeController($scope, $state, Home, $http){

  $scope.member = {};
  $scope.allMembers = Home.allMembers;
  $scope.trendingMembers = Home.trendingMembers;
  $scope.isMapView = false;
  $scope.stateMembers = [];
  $scope.userStateMembers = [];
  $scope.isUS = false;
  $scope.state = false;


  $scope.gotoMember = function(){
    var id = $scope.memberSearch.id;
    $state.go('profile', {id:id});
  };

  $scope.switchView = function() {
    $scope.isMapView = $scope.isMapView ? false : true;
  };

  $scope.getUserState = function(){
    // get the user's coordinates
    navigator.geolocation.getCurrentPosition(function(position) {

      // translate the coordinates into an address
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude +","+ position.coords.longitude + "&key=AIzaSyBKHwql6tqU3mTwqRTpjhhKo5yohkWwvnk")
      .then(function(response){

        // get the address from the http get request
        var address = response.data.results[0].address_components;

        // creates an object that we can to quickly to find out the user's state abbreviation
        var stateInitials = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
        var stateKeys = stateInitials.reduce(function(obj, state){
          obj[state] = true;
          return obj;
        }, {});

        // loop through the address to find out if the user is in the US,
        // and if so, find out their state
        address.forEach(function(obj){
          if (obj.short_name === 'US'){
            $scope.isUS = true;
            address.forEach(function(obj){
              if (obj.short_name in stateKeys){
                $scope.state = obj.short_name;
              }
            });
            // call the method that grabs the members of the user's state so they can be shown on the front page
            $scope.getStateMembers($scope.state, true);
          }
        });

        console.log("$scope.isUS = ", $scope.isUS);
        console.log("$scope.state = ", $scope.state);
      });
    });
  };

  $scope.getUserState();

  $scope.getStateMembers = function(state, geolocation) {
    // points to which array we want to fill based on whether this is in response to the user's location or the map
    var resultsArray;
    if (geolocation){
      resultsArray = $scope.userStateMembers;
    } else {
      $scope.stateMembers = [];
      resultsArray = $scope.stateMembers;
    }

    for (var i = 0; i < $scope.allMembers.length; i++){
      var memberTitle = $scope.allMembers[i].title;

      // console.log('memberTitle:', memberTitle);

      // get the state appreviation from each congressman
      // and check if it matches the state the user clicked on
      if(memberTitle.match(/.*\[.*\-(.{2})/)){
        var memberState = memberTitle.match(/.*\[.*\-(.{2})/)[1];
        if (memberState === state){
           resultsArray.push($scope.allMembers[i]);
           console.log();
        }
      } else {
        console.log("did not work ", memberTitle);
      }
    }
    $scope.$apply(function(){
      resultsArray = resultsArray;
    });
  };

  $('#map').usmap({
    click: function(event, data) {
      $scope.getStateMembers(data.name);
    }
  });

};

