var fs = require('fs');
var sys = require('sys');
var Twitter = require('twitter');
var app = require('express').createServer();

var twitter = new Twitter();

var cache = {};

app.get('/user/:userName', function(req, res){
	var user = cache[ req.params.userName ];
	if (user){
		sys.puts('got from cache');
		res.send(user);
		return;
	}
	
	user = {};
	twitter.get('/users/show.json', {include_entities: true, screen_name: req.params.userName}, function(userData) {
		
		user.userName = userData.screen_name;
		user.fullName = userData.name;
		user.guid = userData.id;
		user.location = userData.location;
		user.bio = userData.description;
		user.profileImageUrl = userData.profile_image_url;
		user.tweetCount = userData.statuses_count;
		user.followersCount = userData.followers_count;
		user.followingCount = userData.friends_count;
		
		twitter.get('/statuses/user_timeline.json', {screen_name: req.params.userName, count: 100, trim_user: true, include_rts: false}, function(tweetsData){
			user.tweets = tweetsData;
			
			// add to cache
			cache[ user.userName ] = user;
			
			res.send(user);
		});
	});
});

app.listen(3000);