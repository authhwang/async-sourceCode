var consoleFunc = function(val,callback) {
  console.log('进入第' + val + '方法');
  callback(null,val);
};

var consoleAsnyc = function(val,callback) {
  console.log(val);
  setTimeout(function() {
    console.log('进入第' + val + '方法');
    callback(null,val);
  }, 1);
}

module.exports = {
  consoleFunc,
  consoleAsnyc,
};