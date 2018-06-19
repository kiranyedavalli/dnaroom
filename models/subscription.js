// subscription model
var mongoose = require('mongoose');

// subscription schema
var subscriptionSchema = new mongoose.Schema({
	user:{
		type: String,
		required: true,
		unique: true
	},
	subscriptions:[{
		type: String
	}],
	created_date:{
		type: Date,
		default: Date.now
	}
});

var Subscription = module.exports = mongoose.model('subscription',subscriptionSchema);

// Clear the collection
module.exports.clearSubscriptions = function(){
	Subscription.remove({}, function(err) { 
   		console.log('Subscriptions removed') 
	});
}

//get subscriptions
module.exports.getSubscriptions = function(callback,limit){
	Subscription.find(callback).limit(limit);
}

//get subscriptions by user
module.exports.getSubscriptionsByUser = function(user,callback){
	Subscription.find({user:user},callback);
}

//add subscription
module.exports.addSubscription = function(subscription,callback){
	Subscription.create(subscription,callback);
}

//get topic subscribers
module.exports.getTopicSubscribers = function(topic, callback){
	
	var userArray = [];

	var query = Subscription.find({subscriptions : topic}).select({'user' : 1, '_id' : 0});

	query.exec(function(err,users){
		if(err){
			return callback(err,null);
		}
		for(var i=0;i<users.length;i++){
			userArray.push(users[i].user);
		}
		return callback(null,userArray);
	})
}