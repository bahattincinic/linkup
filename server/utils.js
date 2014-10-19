
mm = require('moment');
var since_epoch = function(days) {
    return mm().subtract(days, 'days').unix();
};

var hot = function (score, days) {
    var order = Math.log(Math.max(Math.abs(score), 1), 10) / Math.log(10);
    var sign = 0;
    if (score > 0)
        sign = 1;
    else if (score < 0)
        sign = -1
    var seconds = since_epoch(days);
    return Math.round(order + sign * seconds / 45000, 7);
};

console.log(since_epoch(10))