var Sequelize = require('sequelize');

module.exports = function(db) {
  //what the below code is doing is linking this Tweet object with the table Tweets
    var Tweet = db.define('Tweet', { //even though it says Tweet there it adds an 's' to the end when its defined
        tweet: Sequelize.STRING
    }, {
        timestamps: false // this will deactivate the time columns
    });

    return Tweet;
};
