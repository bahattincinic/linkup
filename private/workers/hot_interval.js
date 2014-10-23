/* hot_interval worker */
var mq = require('amqp').createConnection({host: 'localhost'});
var hot = require('../utils/hot');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var Worker = {
  lock: 'hot_interval',
  queueOptions: {
    autoDelete: false,
    durable: true
  }
};

mq.on('ready', function () {
  var q = mq.queue('hot_interval', Worker.queueOptions, function(queue) {

    var redis = require('redis').createClient();
    redis.on('ready', function () {
      MongoClient.connect('mongodb://localhost:27017/linkup', function (err, db) {
        if (err)
          console.log(err);

        console.log('all ready.. sub to messages');

        q.bind('#');

        q.subscribe(function (message, headers, deliveryInfo, messageObject) {
          console.log('Process message ' + message);
          // check for lock, if it exists return quietly
          redis.exists(Worker.lock, function (err, rr) {
            if (err)
              console.log(err);

            if (rr == 1) {
              console.log('Cannot obtain lock, return');
              return;
            } else {
              try {
                console.log('Locking');
                // set to expire in 5 mins
                redis.setex(Worker.lock, 60 * 5, '1');
                console.log(hot);
                console.log('Since epoch  ' + hot.since_epoch(10));
                var collection = db.collection('posts');
                var cursor = collection.find({});
                console.log(cursor);

                cursor.toArray(function (err, docs) {
                  if (err)
                    console.log(err);


                  if (docs) {
                    docs.forEach(function (post) {
                      console.log(moment().diff(post.createdAt));
                    });
                  } else {
                    console.log('err no doc found!');
                  }


                  // db.close();
                });

                cursor.rewind();
              } finally {
                // release lock
                redis.del(Worker.lock);
              }
            }
          });
        });
      });
    });  // redis ready
  });
});

