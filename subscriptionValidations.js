//subscriptionValidations.js

Topics = require('./models/topic')

module.exports.validateTopics = function(stopics, callback){



	if(stopics.length === 0){
		console.log('No topics specified');
		return callback(true,'No topics specified')
	}
	Topics.getTopicArray(function(err,topicArray) {
		if(err){
			return callback(true,err);
		}

		console.log('topicArray: ', topicArray);

	if(stopics.constructor === Array){

		for(var i=0;i<stopics.length;i++){
			if(topicArray.indexOf(stopics[i])<0){
				console.log('Not a valid topic');
				return callback(true, stopics[i] + ' is not a valid topic');
			}
		}
	}
	else{
		if(topicArray.indexOf(stopics)<0){
			console.log('Not a valid topic');
			return callback(true, stopics + ' is not a valid topic');
		}
	}	
		console.log('valid topics');
		return callback(false,'Valid Topics');
	});

}
