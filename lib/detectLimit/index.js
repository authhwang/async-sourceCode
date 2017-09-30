const helper = require('../../vendor/helper.js');
const async = require('async');
                                                                                 //1
async.detectLimit(['1','2','3'],2,helper.consoleAsnyc,function(err, result){     //2
  console.log('完成第' + result + '个方法');                                       //进入1
});                                                                              //完成1
                                                                                 //进入2

async.detectLimit(['1','2','3'],2,helper.consoleFunc,function(err,result){
  console.log('完成第' + result + '个方法');                                       //进入1
});                                                                              //完成1