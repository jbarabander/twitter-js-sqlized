// pull in the Sequelize library
var Sequelize = require('sequelize');
// create an instance of a database connection
// which abstractly represents our app's mysql database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {
    dialect: "mysql",
    port:    3306,
});

// open the connection to our database
twitterjsDB
  .authenticate()
  .catch(function(err) {
    console.log('Unable to connect to the database:', err);
  })
  .then(function() {
    console.log('Connection has been established successfully.');
  });

  var Tweet = require('./tweets')(twitterjsDB);
  var User = require('./user')(twitterjsDB);

  // adds a UserId foreign key to the `Tweet` table
  User.hasMany(Tweet); //this creates the getTweets() methods
  Tweet.belongsTo(User); //this creates the foreign key association of ModelId in user

  module.exports = {
      User: User,
      Tweet: Tweet
  };
