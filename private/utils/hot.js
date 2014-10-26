
var hot = function (score, seconds) {
  console.log("score: " + score + " seconds: " + seconds);
  var order = Math.log(Math.max(Math.abs(score), 1), 10) / Math.log(10);
  var sign = 0;
  if (score > 0)
      sign = 1;
  else if (score < 0)
      sign = -1
  var secs = seconds - 1134028003;
  return Math.round(order + sign * secs / 45000, 7);
};

exports.calculate = hot;