var spark = require('ciscospark/env');
//process.env.CISCOSPARK_ACCESS_TOKEN = 'OTMzYTNlMGYtYzhkMC00ZTEyLWIzNDAtMmY2ZjBiZmEyZDJiOTRiMmU0ZDYtZDMw';

module.exports.createSparkRoom = function(name,callback){

    spark.rooms.create({
      title: name
    })
  // Make sure to log errors in case something goes wrong.
      .catch(function(reason) {
          console.error(reason);
          return callback(reason);
    });
    return callback();
}

module.exports.sendMessage = function(roomName, topic, message, callback){
    spark.rooms.list({
       max: 10
    })
      .then(function(rooms) {
          var room = rooms.items.filter(function (room) {
          return room.title === roomName;
      })[0];

      spark.messages.create({
            text: 'TOPIC: ' + topic + '. MESSAGE: ' + message,
            roomId: room.id
      });
      return callback();
})
// Make sure to log errors in case something goes wrong.
.catch(function(reason) {
  console.error(reason);
  return callback(reason);
});
}