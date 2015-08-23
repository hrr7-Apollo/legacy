[![Build Status](https://travis-ci.org/hrr7-Apollo/legacy.svg?branch=master)](https://travis-ci.org/hrr7-Apollo/legacy) - Master Branch

[![Build Status](https://travis-ci.org/hrr7-Apollo/legacy.svg?branch=development)](https://travis-ci.org/hrr7-Apollo/legacy) - Development Branch

# Project Name

  Political Profiler

## Team

  - __Product Owner__: Diedra Rater
  - __Scrum Master__: Nick Balestra
  - __Development Team Members__: Derek Olson, Greg Varias



## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Requirements

- Node 0.12.x
- Angular 1.4.x
- Angular-animate: 1.4.3
- Angular-loading-bar: 0.8.0
- Angular-mocks: 1.4.3
- Angular-ui-bootstrap: 0.13.3
- Angular-ui-router: 0.2.15
- Bluebird: 2.9.34
- Bootstrap: 3.3.5
- Bower: 1.4.1
- Browserify: 11.0.1
- Browserify-shim: 3.8.10
- D3: 3.5.6
- Debug: 2.2.0
- Del: 1.2.0
- Ejs: 2.3.3
- Express: 4.13.3
- Govtrack-node: 0.2.0
- Gulp: 3.9.0
- Gulp-autoprefixer: 2.3.1
- Gulp-browserify: 0.5.1
- Gulp-clean: 0.3.1
- Gulp-concat: 2.6.0
- Gulp-jshint: 1.11.2
- Gulp-sass: 2.0.4
- Gulp-sourcemaps: 1.5.2
- Gulp-uglify: 1.2.0
- Gulp-util: 3.0.6
- Karma: 0.13.8
- Karma-browserify: 4.3.0
- Karma-chrome-launcher: 0.2.0
- Karma-mocha: 0.2.0
- Path-parse: 1.0.5
- Serve-favicon: 2.3.0
- Underscore: 1.8.3
- Vinyl-buffer: 1.0.0
- Vinyl-source-stream: 1.1.0
- Vinyl-transform: 1.0.0

## Development

### Setup
Have `gulp` installed

Enter `npm start` in one terminal window

Run `gulp` in the root of the project in a different terminal window. This will start the `gulp watch` task, which runs js-hint and builds the project files in the public folder.

Every time a change is made in the client folder, the project will be re-built and placed in the public folder in real-time. One of the tasks automatically run by gulp watcher during this step is `browserify-dev`, which executes very quickly, but produces a huge concatenated js file. Therefore this is suitable (and convenient) only for development purposes.

### Installing Dependencies

Have bower and node installed.

From within the root directory run:

```
npm install
bower install
```

### Loading sample bill data

In your terminal, run mongodb by typing in the command
```
mongod
```

In a new terminal tab, switch into the server folder, enter the mongo shell by using the command
```
mongo
```

Select the 'legacy' database by running the command
```
use legacy
```
and run the following commands:

```
load('billSeedFile.js');
db.billentries.createIndex( { terms: "text" } );
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.



## Road Map

Questions:
- what database management system are we using?
- are we deploying on Heroku? something else?


Back-end team:
[x] implement a database
[x] when a user searches for a senator, check if that person has already been stored if not, grab query the api for that person and store it in the database
[x] when a user searches for a senator recent votes, check if those votes has already been stored if not, grab query the api for that person and store it in the database
- Updated tests to reflect the new architecture with the caching layer
- Refactor and cleanup the server.js (abstracting and definign away all the callbacks for the cacheOnDB() )

Stretch:
[x] research into getting bulk data of bills for keywords - Too costly and against our space complexity costs
- Add logic to invalidate cache after a sepcified amount fo time
- if we can get the keywords from bulk calls, try storing bills from limited time period (ie last 30 days) for easy keyword-searching
- on user searching for a keyword, query the database for recent bills with that keyword, then store in the database for future searches



Front-end team:
- implement geolocation to find the user's state
- show/suggest senators for that state
- remove 'recent searches'? is that a useful feature? or just place the senators for the user's location above that section
- or combine the two features and make a suggested senators based on location first and last searched second
- maybe start with a naive approach first (just based on location with api call), and then expand it later if we feel it would be worthwhile enough to the user based on the time it would take the implement it

- research development with heroku (any limitations for database/storage?)


Stretch:
- add ui improvements/slight design
