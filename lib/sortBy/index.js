const async = require('async');
const helper = require('../../vendor/helper');

async.sortBy([3,1,2],helper.consoleFunc,function(err,result){                 //进入3
  console.log('得到结果为' + result);                                          //进入1
});                                                                          //进入2
                                                                            //得到结果为 1,2,3
                                              
async.sortBy([3,1,2],helper.consoleFunc,function(err,result){                 //3
  console.log('得到结果为' + result);                                          //1
});                                                                          //2
                                                                             //进入3
                                                                             //进入1
                                                                             //进入2
                                                                            //得到结果为 1,2,3
                
