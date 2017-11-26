const async = require('async');
var count = 0;

async.during(
  function (callback) {
    return callback(null, count < 5);
  },
  function (callback) {
    count ++;
    setTimeout(callback, 1000);
  },
  function (err) {
    console.log(count);
  }
);