// Profile Controller

var d3 = require('d3');

module.exports = function profileController($scope, $stateParams, Home, $http){

  var memberId1=$stateParams.id;

  $scope.allMembers = Home.allMembers;
  $scope.member = {};
  $scope.secondMember = {};
  $scope.commonVotes = [];
  $scope.test=0;
  $scope.filteredBillIds = [];

  getMember(memberId1, $scope.member);

 /*******************************************
   * Load one Member Profile from Factory
   ******************************************/

   function getMember(id, member){
    Home.getMember(id)
    .then(function(data){
      member.data = data;
      member.data.age=calculateAge(new Date(member.data.birthday));
      //Load D3 Graph when politican is added
      loadGraph(id, member.data.fullname);
      return member;
    }).then(function(member){
      getMemberVotes(member);
    }).catch(function(err){
      throw err;
    });
  }

   /*******************************************
   * Load votes for the member from Factory,
   * add to member object
   ******************************************/

   function getMemberVotes(member){
    Home.getMemberVotes(member.data.id)
    .then(function(votes){
      member.data.votes = votes;
    }).catch(function(err){
      throw err;
    });
  }


  function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /*******************************************
   * Load Second Member Profile from Factory
   ******************************************/
   $scope.loadMember = function (){
    var memberId2 = $scope.addMember.id;
    getMember(memberId2, $scope.secondMember);
    // Clear Member input on second politician search
    $scope.addMember = null;
   };

   /*******************************************
    * Remove Compared Politician
    ******************************************/
    $scope.removePolitician = function() {
      $scope.secondMember.data.id = null;
      //Remove Vote Graph
      $(".graph svg:last-child").remove();
    };

   /*******************************************
    * Search Votes by Keyword
    ******************************************/
    $scope.getBillsByKeyword = function(){
      // if there was a keyword typed in the text box
      if ($scope.billKeyword){
        // get text out of input field
        var keyword = $scope.billKeyword.replace(/ /g, '_');
        console.log('scope billKeyword:', $scope.billKeyword);
        // send GET request to /searchKeywords with text as params
        $http({
          method: 'GET',
          url: '/searchKeywords/' + keyword,
        })
        .then(function(res){
          // use $scope var to store bill_ids so they can be compared against the votes presented to the user
          $scope.filteredBillIds = res.data;
          console.log("$scope.filteredBillIds:", $scope.filteredBillIds);
        });
      } else {
        // reset the filter
        $scope.filteredBillIds = [];
      }
    };

    /*******************************************
    * Filter Votes by Keyword
    ******************************************/
    $scope.filterVotesByKeyword = function(){
      // check to see if the data has loaded and a keyword has been searched for in the bills collection
      if ($scope.member.data && $scope.member.data.votes){
        if ($scope.billKeyword && $scope.billKeyword.length){
          // return true if the vote has a bill id that matches the bill ids returned from the keyword search
          return $scope.member.data.votes.filter(function(vote) {
            return $scope.filteredBillIds.indexOf(vote.bill_id) !== -1;
          });
        } else {
          return $scope.member.data.votes;
        }
      }
    };

  /*******************************************
   * Plot Historical Votes on Graph
   ******************************************/
   function loadGraph(memberId, memberName){
      Home.getHistoricVotes(memberId)
        .then(function(data){

          //Parse date / time
          var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

          //Pretty Date Format - Used for tooltip date
          var prettyDate = d3.time.format("%B %d, %Y");

          //Parse Date and coerce numbers for ease of use
          data.forEach(function(d){
            d.created = parseDate(d.created);
            d.vote.percent_plus = +d.vote.percent_plus;
          });

          //Set Margin, Padding, Width and Height for SVG element
          var margin = {top: 20, right: 20, bottom: 60, left: 40},
              padding = {top: 40, right: 30, bottom: 50, left: 40},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          //Set scale of x axis to time scale, using d.created for domain
          var xScale = d3.time.scale().range([0, width]).domain(d3.extent(data, function (d) { return d.created; }));
          //Return created value from data
          var xValue = function(d) { return d.created; };
          //Map returned value to x scale
          var xMap = function(d) { return xScale(xValue(d)); };
          //Format x axis
          var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickFormat(d3.time.format('%b \'%y'));

          //Set scale of y axis as percentage, using domain of 0 and 100
          var yScale = d3.scale.linear().range([height, 0]).domain([0, 100]);
          //Return the percent_plus (% in favor of bill) as integer
          var yValue = function(d) { return d.vote.percent_plus * 100; };
          //Map returned value to y scale
          var yMap = function(d) { return yScale(yValue(d)); };
          //Format y axis
          var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(3);

          //Create zoom behavior that calls zoomed function
          var zoom = d3.behavior.zoom()
              .x(xScale)
              .y(yScale)
              .scaleExtent([1, 10])
              .on("zoom", zoomed);

          //Append svg to graph element with sizing
          var vis = d3.select(".graph").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
              //Make svg element 'zoomable'
              .call(zoom);

          vis.append("rect")
              .attr("width", width)
              .attr("height", height);

          var svg = vis.append("svg")
           .attr('top', 0)
           .attr('left', 0)
           .attr('width', width)
           .attr('height', height)
           .attr('viewBox',  "0 0 " + width + " " + height);

          // Add x-axis and Label
          vis.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append('text')
              .attr('class', 'label')
              .attr('x', (width - padding.left) / 2)
              .attr('y', 32)
              .style('text-anchor', 'bottom')
              .text('Date of Vote');

          // Add y-axis and Label
          vis.append("g")
              .attr("class", "y axis")
              .call(yAxis)
             .append('text')
               .attr('class', 'label')
               .attr('transform', 'rotate(-90)')
               .attr('x', -(height / 1.5) )
               .attr('y', -30)
               .style('text-anchor', 'bottom')
               .text('% of Members In Favor of Bill');

          // Add politician name
          vis.append("text")
            .attr('class', 'axis')
            .attr('x', (width - padding.left - 50) / 2)
            .attr('dy', "-.75em")
            .text(memberName);

          //Setup Fill Color based on Vote value
          var color = function(value) {
            if (value === 'Yea' || value === 'Aye') {
              //set color to green and return
              return '#7bc043';
            } else if (value === 'Nay' || value === 'No') {
              //set color to red and return
              return '#ee4035';
            } else {
              //set color to gray and return
              return '#aaaaaa';
            }
          };

          //Add Tooltip
          var tooltip = d3.select('body').append('div')
           .attr('class', 'tooltip')
           .style('opacity', 0);

          //draw votes
          svg.selectAll('circle')
           .data(data)
          .enter().append('circle')
           .attr('class', 'vote')
           .attr('r', 3.5)
           .attr('cx', xMap)
           .attr('cy', yMap)
           .style('fill', function (d) { return color(d.option.value); })
           .on('click', function (d, i) { window.open( d.vote.link, '_blank'); })
           .on('mouseover', function (d) {
             tooltip.transition()
               .duration(500)
               .style('opacity', '.95');
             tooltip.html('<dl><dt>Topic: </dt><dd>' + d.vote.question + '</dd><dt>Vote/Category: </dt><dd>' + d.option.value +" / "+ d.vote.category + '</dd><dt>Date: </dt><dd>' + prettyDate(d.created) + '</dd></dl>')
               .style('left', (d3.event.pageX + 15) + 'px')
               .style('top', (d3.event.pageY + 15) + 'px')
               .style('padding', "5px")
               .style('border-radius', '10px')
               .style('background', '#FEFEFE' );
           })
           .on('mouseout', function (d){
             tooltip.transition()
               .duration(500)
               .style('opacity', 0);
           });

          // Controls Zoom and circle resizing
          function zoomed() {
            //Redraw Axes
            vis.select(".x.axis").call(xAxis);
            vis.select(".y.axis").call(yAxis);
            //Shrink circles based on zoom scale, will enlarge on zoom out
            svg.selectAll('circle')
             .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
             .attr('r', 3.5 / d3.event.scale );
          }
        })
        //Catch error from promise
        .catch(function(err){
          throw err;
        });
   }
};


