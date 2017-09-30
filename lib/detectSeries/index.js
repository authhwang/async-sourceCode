const helper = require('../../vendor/helper.js');
const async = require('async');
                                                                                 //1
async.detectSeries(['1','2','3'],helper.consoleAsnyc,function(err, result){      //进入1
  console.log('完成第' + result + '个方法');                                       //完成1
});                                                                              
                                                                                 

async.detectSeries(['1','2','3'],helper.consoleFunc,function(err,result){
  console.log('完成第' + result + '个方法');                                       //进入1
});                                                                              //完成1