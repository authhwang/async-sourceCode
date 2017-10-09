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

var consoleFuncForObj = function(val,key,callback) {
  console.log('进入键为' + key + '值为' + val + '方法');
  callback(null,val);
};

var consoleAsnycForObj = function(val,key,callback) {
  console.log('键为' + key + '值为' + val);
  setTimeout(function() {
    console.log('进入键为' + key + '值为' + val + '方法');
    callback(null,val);
  }, 1);
};

var consoleFuncForReduce = function(memo,item,callback) {
  console.log('进入memo为' + memo + ' item为' + item);
  callback(null,memo + item);
};

var consoleAsyncForReduce = function(memo,item,callback) {
  console.log('进入memo为' + memo + 'item为' + item);
  callback(null,memo + item);
};

module.exports = {
  consoleFunc,
  consoleAsnyc,
  consoleFuncForObj,
  consoleAsnycForObj,
  consoleFuncForReduce,
  consoleAsyncForReduce
};