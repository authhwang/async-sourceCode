const async = require('async');
const helper = require('../../vendor/helper');

async.some(['1','2','3'],helper.consoleFunc,function(err,result) {                      //进入1
  console.log('得到' + result + '结果');                                                 //得到true结果
});                                                                                    //进入2
                                                                                       //进入3

async.some(['1','2','3'],helper.consoleAsnyc,function(err,result) {                      //1
  console.log('得到' + result + '结果');                                                 //2
});                                                                                    //3
                                                                                       //进入1
                                                                                       //得到true结果
                                                                                       //进入2
                                                                                       //进入3