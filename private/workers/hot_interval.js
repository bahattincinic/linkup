/* hot_interval worker */
var mq = require('amqp').createConnection({host: 'localhost'});

var Worker = {
  lock: 'hot_interval',
  queueOptions: {
    autoDelete: false,
    durable: true
  }
};

mq.on('ready', function () {
  console.log('Hot Interval ready');
  var q = mq.queue('hot_interval', Worker.queueOptions, function(queue) {
    console.log('Queue ' + queue.name + ' is open');

    var redis = require('redis').createClient();
    redis.on('ready', function () {
      console.log('all ready.. sub to messages');
      q.bind('#');
      q.subscribe(function (message, headers, deliveryInfo, messageObject) {
        console.log('Process hot_interval');
        // check for lock, if it exists return quietly
        redis.exists(Worker.lock, function (err, rr) {
          if (err) throw err;

          if (rr == 1)
            return;
          else {
            try {

            } finally {
            }
          }
        });
        // if (redis.get(Worker.lock)) {
        //   console.log('cannot acquire lock');
        //   return;
        // }

        // try {
        //   redis.set(Worker.lock, 'True', redis.print);
        // } finally {
        //   console.log('close this');
        // }
      });
    });
  });
});