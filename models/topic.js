var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
	topic:{
		type:String,
		unique: true,
		required: true
	}
});

var Topics = module.exports = mongoose.model('topic',topicSchema);

// Clear the collection
module.exports.clearTopics = function(){
	Topics.remove({}, function(err) { 
   		console.log('Topics removed') 
	});
}

// seed topics
module.exports.seedTopics = function(){

	   Topics.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Topics.create({ topic: 'network' });
            Topics.create({ topic: 'host' });
            Topics.create({ topic: 'connectivity'});
            console.log('Topics seeded')
        }
    });
}

//get topics
module.exports.getTopics = function(callback,limit){
	Topics.find(callback).limit(limit);
}

module.exports.getTopicArray = function(callback){
	var topicArray = [];

	var query = Topics.find({}).select({'topic' : 1, '_id' : 0});

	query.exec(function (err, topics) {
        if (err){
        	return callback(err, null);
        }
        console.log('topics: ', topics);
        if(topics.constructor === Array){
	        for(var i=0;i<topics.length;i++){
	        	topicArray.push(topics[i].topic);
	        }
	    }
	    else{
	    	topicArray.push(topics.topic);
	    }
        return callback(null,topicArray);
    
    });
}
