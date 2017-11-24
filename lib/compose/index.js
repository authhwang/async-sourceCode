const async = require('async');

function add1(n,callback) {
  setTimeout(function() {
    callback(null, n + 1);
  }, 10);
}

function mul3(n,callback) {
  setTimeout(function() {
    callback(null, n * 3);
  }, 10);
}

var add1mul3 = async.compose(mul3,add1);
add1mul3(4, function(err, result) {
  console.log(result);
});