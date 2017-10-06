const helper = require('../../vendor/helper');
const async = require('async');

async.map(['1','2','3'],helper.consoleFunc,function(err,result){           //进入1
  console.log('得到' + result + '结果');                                    //进入2
});                                                                       //进入3
                                                                          //得到1,2,3个结果

async.map(['1','2','3'],helper.consoleAsnyc,function(err,result){      //1
  console.log('得到' + result + '结果');                                   //2
});                                                                      //3
                                                                        //进入1
                                                                        //进入2
                                                                        //进入3
                                                                        //得到1,2,3个结果