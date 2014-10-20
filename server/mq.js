console.log('mq starts');

var amqp = Npm.require('amqp');
var connection = amqp.createConnection({ host: 'localhost' });

connection.on('ready', function() {
  console.log('MQ ready');
  var q = connection.queue('sample', function(queue) {
    console.log('Queue ' + queue.name + ' is open');
    q.bind('#');

    q.subscribe(function (message, headers, deliveryInfo, messageObject) {
      console.log('Got a message with routing key ' + deliveryInfo.routingKey);
    });
  });
});
