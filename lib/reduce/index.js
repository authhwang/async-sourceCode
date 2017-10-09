const helper = require('../../vendor/helper');
const async = require('async');

async.reduce([1,2,3],1,helper.consoleFuncForReduce,function(err,result){           //进入memo为1 item为1
  console.log('得到结果为' + result);                                                //进入memo为2 item为2
});                                                                                //进入memo为4 item为3
                                                                                   //得到结果为7

async.reduce([1,2,3],1,helper.consoleAsyncForReduce,function(err,result){           //进入memo为1 item为1
  console.log('得到结果为' + result);                                                //进入memo为2 item为2
});                                                                                //进入memo为4 item为3
                                                                                   //得到结果为7