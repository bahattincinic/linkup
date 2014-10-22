
var since_epoch = function(mins) {
  mm = require('moment');
  return mm().subtract(mins, 'mins').unix();
};

var hot = function (score, mins) {
  var order = Math.log(Math.max(Math.abs(score), 1), 10) / Math.log(10);
  var sign = 0;
  if (score > 0)
      sign = 1;
  else if (score < 0)
      sign = -1
  var seconds = since_epoch(mins);
  return Math.round(order + sign * seconds / 45000, 7);
};

exports.since_epoch = since_epoch;
exports.hot = hot;