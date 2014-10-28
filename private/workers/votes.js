/* process votes
*/

var mq = require('amqp').createConnection({host: 'localhost'});
var redis = require('redis').createClient();
var util = require('util');
var mongo = require('mongodb').MongoClient;
var hot = require('../utils/hot');
var moment = require('moment');

var Worker = {
  name: 'votes',              // name of the queue
  keyPrefix: 'post',
  lockInterval: 30,           // half a minute
  // hbInterval: 1000 * 60 * 1,  // a minute
  queueOptions: {
    autoDelete: false,
    durable: true
  },
  mongourl: 'mongodb://localhost:27017/linkup',
  possibleVotes: [-1, 1]
};

mq.on('ready', function () {
  console.log('connected queue..');

  var q = mq.queue(Worker.name, Worker.queueOptions, function () {
    console.log('queue ready, subscribe');
    q.bind('#');
    q.subscribe(handleMessage);
  });
});

function handleMessage(message, headers, deliveryInfo, messageObject) {
  console.log(message.vote, message.post);
  if (message.vote && Worker.possibleVotes.indexOf(message.vote) != -1 && message.post) {
    var key = util.format('%s-%s', Worker.keyPrefix, message.post);
    message.key = key;
    redis.exists(key, function checkLock(err, rr) {
      if (err) {
        console.log(err);
        return;
      }

      if (rr == 1) {
        console.log('Cannot obtain lock, return');
        return;
      }

      processPost(message);
    });
  } else {
    console.log('Invalid message');
    return;
  }
};

function processPost(message) {
  try {
    // lock this post first
    redis.setex(message.key, Worker.lockInterval, '1');
    // move on to update post
    mongo.connect(Worker.mongourl, function onDbConnect(err, db) {
      if (err) {
        console.log('Cannot connect to db: ' + err);
        return;
      }

      var collection = db.collection('posts');
      collection.findOne({_id: message.post}, function(err, post) {
        if (err) {
          console.log('Error while finding post: ' + err);
          return;
        }

        if (!post) {
          console.log('no such post, discard vote');
          return;
        }

        // update posts score, hot and updatedAt fields
        var d = moment(post.createdAt).unix();
        var newScore = post.score + message.vote;
        var hh = hot.calculate(newScore, d);

        collection.update({
          _id: post._id
        }, {
          $set: {
            hot: hh,
            score: newScore,
            updatedAt: moment().utc().toDate()}
        }, function (err) {
          if (err) {
            console.log('Error while updating score: ' + err);
            return;
          }

          // we are done here
          db.close();
        });
      });
    });
  } finally {
    redis.del(message.key);
  }
};

// aDSaL53izrkj3JbTq
