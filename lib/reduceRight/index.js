const helper = require('../../vendor/helper');
const async = require('async');

async.reduceRight([1,2,3],1,helper.consoleFuncForReduce,function(err,result){           //进入memo为1 item为3
  console.log('得到结果为' + result);                                                     //进入memo为2 item为2
});                                                                                     //进入memo为4 item为1
                                                                                        //得到结果为7

async.reduceRight([1,2,3],1,helper.consoleAsyncForReduce,function(err,result){           //进入memo为1 item为3
  console.log('得到结果为' + result);                                                      //进入memo为2 item为2
});                                                                                       //进入memo为4 item为1
                                                                                          //得到结果为7