mm = require('moment');
var xx = function(days) {
    return mm().subtract(days, 'days').unix();
};

var hot = function (score, days) {
    var order = Math.log(Math.max(Math.abs(score), 1), 10) / Math.log(10);
    console.log(order);
    var sign = 0;
    if (score > 0)
        sign = 1;
    else if (score < 0)
        sign = -1
    console.log(sign);
    var seconds = since_epoch(days);
    console.log(seconds);
    return Math.round(order + sign * seconds / 45000, 7);
};
console.log(xx(10))
console.log(since_epoch(10))


// from math import log
// from datetime import datetime, timedelta
// import time

// epoch = datetime(1970, 1, 1)
// now = datetime.now()

// def since_epoch(days):
//     """Returns the number of seconds from the epoch to date."""
//     ee = int(time.time())
//     return ee - int(timedelta(days=10).total_seconds())

// def hot(score, days):
//     s = score
//     order = log(max(abs(score), 1), 10)
//     print order
//     sign = 1 if s > 0 else -1 if s < 0 else 0
//     print sign
//     seconds = since_epoch(days)
//     print seconds
//     return round(order + sign * seconds / 45000, 7)