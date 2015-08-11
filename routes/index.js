// var tweetBank = require('../tweetBank');
var Tweet = require('../models/index').Tweet;
var User = require('../models/index').User;


module.exports = function (io) {
	var router = require('express').Router();

	router.get('/', function (req, res) {
		// will trigger res.send of the index.html file
		// after rendering with swig.renderFile
		Tweet.findAll({include: [User]}).then(function(result) {
			return result.map(function(element) {
				return element.dataValues;
			});
		}).then(function(resultingSet) {
			// console.log(resultingSet);
			res.render('index', {
				showForm: true,
				title: 'Home',
				tweets: resultingSet
			});
		});

	});

	router.get('/users/:name', function (req, res) {
		User.findOne({
			where: {name: req.params.name}
		}).then(function(user){
			return user.getTweets();
		}).then(function(tweets) {
			res.render('index', {
				showForm: true,
				title: req.params.name,
				tweets: tweets,
				theName: req.params.name
			});
		});
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var id = parseInt(req.params.id);
		Tweet.findOne({include: [User],where: {id: id}}).then(function(selectedTweet){
			res.render('index', {title: req.params.name, tweets: [selectedTweet.dataValues]});
		});
	});

	router.post('/submit', function (req, res) {
		name = req.body.shenanigans;
		text = req.body.text;
		User.findOne({where: {name: name}}).then(function(user) {
			//default pictureUrl: https://pbs.twimg.com/profile_images/378800000500453121/0f8ead5d3dbd4e3f747aaca6bf3b8d9a.png
			if(!user){
				User.create({
					pictureUrl: 'https://pbs.twimg.com/profile_images/378800000500453121/0f8ead5d3dbd4e3f747aaca6bf3b8d9a.png',
					name: name
				}).then(function(user) {
					return user.get('id');
				}).then(function(id){
					Tweet.create({
						UserId: id,
						tweet: text
					}).then(function(tweet){
						io.sockets.emit('new_tweet', tweet);
						res.redirect('/');});
				});
			}
			else {
				Tweet.create({
					UserId: user.get('id'),
					tweet: text
				}).then(function(tweet){
					io.sockets.emit('new_tweet', tweet);
					res.redirect('/');
				});
			}
		});
		// var theNewTweet = tweetBank.list().pop();
	});
	return router;
};
