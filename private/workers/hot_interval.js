/* hot_interval worker
  -> connect to message broker
  -> connect to redis
  -> subscribe when redis ready
  -> connect to mongo when a message is received
*/
var mq = require('amqp').createConnection({host: 'localhost'});
var hot = require('../utils/hot');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var redis = require('redis').createClient();

var Worker = {
  lock: 'hot_interval',
  lockInterval: 60 * 1,
  hbInterval: 1000 * 60 * 1,
  queueOptions: {
    autoDelete: false,
    durable: true
  },
  mongourl: 'mongodb://localhost:27017/linkup'
};

var setUpInterval = function () {
  var run = function () {
    mq.publish('hot_interval', {});
  };

  setInterval(run, Worker.hbInterval);
};

mq.on('ready', function () {
  console.log('connected queue..');

  var q = mq.queue(Worker.lock, Worker.queueOptions, function(queue) {
    console.log('queue ready, subscribe');
    q.bind('#');
    q.subscribe(handleMessage);
    // setup heartbeat for this queue
    setUpInterval()
  });
});

function handleMessage(message, headers, deliveryInfo, messageObject) {
  MongoClient.connect(Worker.mongourl, onDbConnect);
};

function onDbConnect(err, db) {
  console.log('Process message');
    // check for lock, if it exists return quietly
  redis.exists(Worker.lock, function checkLock(err, rr) {
    if (err) {
      console.log(err);
      return;
    }

    if (rr == 1) {
      console.log('Cannot obtain lock, return');
      return;
    }

    updatePosts(db)
  });
};

function updatePosts(db) {
  try {
    // set lock to expire in 5 mins
    redis.setex(Worker.lock, Worker.lockInterval, '1');
    var collection = db.collection('posts');
    collection.count(function (err, post_count) {
      var updated = 0;
      var cursor = collection.find({}).sort({createdAt: -1});

      cursor.toArray(function (err, docs) {
        if (err) {
          console.log(err);
          return;
        }

        docs.forEach(function processPost(post) {
          if (post.createdAt && post.score) {
            var d = moment(post.createdAt).unix();
            var hh = hot.calculate(post.score, d);

            collection.update({
              _id: post._id
            }, {
              $set: {
                hot: hh,
                updatedAt: moment().utc().toDate()}
            }, function(err, doc) {
              if (err) {
                console.log('unable to update: ' + err);
                return;
              }

              // mark as updated
              updated += 1;

              // check if all posts are calculated
              if (updated == post_count)
                db.close();
            });
          } // /if createdAt && score
        }); // forEach
      });
    });
  } finally {
    // release lock
    redis.del(Worker.lock);
  }
};