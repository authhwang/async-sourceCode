const async = require('async');
const helper = require('../../vendor/helper.js');

var func = function(val,callback) {                  //进入1
  helper.consoleFunc(val,callback);                  //进入2
}                                                    //进入3
                                                     //完成1,2,3个方法

var funcAsync = function(val,callback) {             //1
  helper.consoleAsnyc(val,callback);                 //2
}                                                    //3
                                                     //进入1
                                                     //进入2
                                                     //进入3
                                                     //完成1,2,3个方法
                                                     
async.concat(['1','2','3'],func,function(err,val){
  console.log('完成第' + val + '个方法');
});
