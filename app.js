// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

// Initiate the app
var app = express();

app.use(bodyParser.json());

// Setup the db
// Connect to Mongoose
mongoose.connect('mongodb://localhost/dnaroom');
var db = mongoose.connection;

// Define collections to use
Subscription = require('./models/subscription');
Topics = require('./models/topic');

// Clear the collections
Subscription.clearSubscriptions(()=>{
	console.log('Cleared subscriptions');
});

Topics.clearTopics(()=>{
	console.log('Cleared Topics');
})

//Seed the data
Topics.seedTopics(() => {
	console.log('Topics seeded');
});

SubValidations = require('./subscriptionValidations');

app.get('/',function(req,res){
	console.log('in get');
	res.send('Hello, welcome to Cisco Network Applicaiton Platform.');
});

app.get('/api/subscription-topics',function(req,res){
	console.log('in subscription topics');
	Topics.getTopics(function(err,topics){
		if(err){
			throw err;
		}
		res.send(topics);
	});
});

app.get('/api/subscriptions',function(req,res){
	console.log('in getSubscriptions');

	Subscription.getSubscriptions(function(err,subscriptions){
		if(err){
			throw err;
		}
		res.send(subscriptions);
	});
});

app.get('/api/subscriptions/:user',function(req,res){
	console.log('in getSubscriptionsByUser with user:', req.params.user);
	Subscription.getSubscriptionsByUser(req.params.user,function(err,subscriptions){
		if(err){
			throw err;
		}
		res.send(subscriptions);
	});
});

app.post('/api/subscriptions',function(req,res){
	console.log('in create subscription');
	var subscription = req.body;
	var user = req.body.user;
	console.log('user: ', user);
	var stopics = req.body.subscriptions;
	SubValidations.validateTopics(stopics,function(invalid,result){
		if(invalid){
			console.error(result);
			res.setHeader('Content-Type','application/json');
			res.status(400).send(JSON.stringify({error: 'Invalid Input. ' + result}));
		}
		else{
			Subscription.addSubscription(subscription, function(err,subscription){
				if(err){
					if(err.name==='MongoError' && err.code === 11000){
						console.error("Duplicate key error");
						res.setHeader('Content-Type','application/json');
						res.status(400).send(JSON.stringify({error: 'Duplicate user'}));
					}
				}
				else{
					res.send('successfully added');
				}
			});
		}
	});

});

Spark = require('./spark');

app.post('/api/ciscospark-room', function(req,res){
	var user = req.body.user;
	Spark.createSparkRoom('Cisco-DNA-' + user, function(err){
		if(err){
			console.error(err);
			res.setHeader('Content-Type','application/json');
			res.status(500).send(JSON.stringify({error: err}));
		}
		else{
			console.log('Created spark room');
			res.send('success');
		}
	});

});	


app.post('/api/message',function(req,res){
	var topic = req.body.topic;
	var message = req.body.message;
	console.log('topic: ' + topic + '. message: ', message);
	SubValidations.validateTopics(topic, function(invalid, result){
		if(invalid){
			console.error(result);
			res.setHeader('Content-Type','application/json');
			res.status(400).send(JSON.stringify({error: 'Invalid Input. ' + result}));
		}
		else{
			Subscription.getTopicSubscribers(topic,function(err,users){
				if (err){
					throw err;
					res.setHeader('Content-Type','application/json');
					res.status(400).send(JSON.stringify({error: 'Invalid Input. ' + err}));
				}
				else{
					console.log('users: ', users);
					if(users.constructor === Array){
						for(var i=0;i<users.length;i++){
							Spark.sendMessage('Cisco-DNA-' + users[i], topic, message, function(err){
								if(err){
									console.error(err);
									res.setHeader('Content-Type','application/json');
									res.status(500).send(JSON.stringify({error: err}));
								}
								else{
									res.setHeader('Content-Type','application/json');
									res.status(200).send(JSON.stringify({success: 'Posted message to ' + users}));
								}
							});
						}
					}
					else{
						Spark.sendMessage('Cisco-DNA-' + users, topic, message, function(err){
							if(err){
								console.error(err);
								res.setHeader('Content-Type','application/json');
								res.status(500).send(JSON.stringify({error: err}));
							}
							else{
								res.setHeader('Content-Type','application/json');
								res.status(200).send(JSON.stringify({success: 'Posted message to ' + users}));
							}
						});
					}
				}

			});
		}
	});

});

app.listen(PORT, ()=>{
	console.log('Running on port ' + PORT + ' ...');	
});
