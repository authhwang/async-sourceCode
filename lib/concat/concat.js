const async = require('async');
const helper = require('../../vendor/helper.js');

var func = function(val,callback) {
  helper.consoleFunc(val,callback);
}

var funcAsync = function(val,callback) {
  helper.consoleAsnyc(val,callback);
}

async.concat(['1','2','3'],func,function(err,val){
  console.log('完成第' + val + '个方法');
});

