var fs = require('fs');
var sys = require('sys');
var Twitter = require('twitter');
var app = require('express').createServer();

var props = JSON.parse(fs.readFileSync('twitter_properties.json', 'utf8'));
sys.puts(props);

var twit = new Twitter({
    consumer_key: props.consumer_key,
    consumer_secret: props.consumer_secret,
    access_token_key: props.access_token_key,
    access_token_secret: props.access_token_secret
});

app.get('/user/:userName', function(req, res){
	var user = {};
	
	twit.get('/users/show.json', {include_entities: true, screen_name: req.params.userName}, function(userData) {
	    sys.puts(sys.inspect(userData));
		
		user.userName = userData.screen_name;
		user.fullName = userData.name;
		user.guid = userData.id;
		user.location = userData.location;
		user.bio = userData.description;
		user.profileImageUrl = userData.profile_image_url;
		user.tweetCount = userData.statuses_count;
		user.followersCount = userData.followers_count;
		user.followingCount = userData.friends_count;
		
		twit.get('/statuses/user_timeline.json', {screen_name: req.params.userName, count: 100, trim_user: true, include_rts: false}, function(tweetsData){
			user.tweets = tweetsData;
			res.send(user);
		});
	});
});

app.listen(3000);