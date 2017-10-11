const async = require('async');
const helper = require('../../vendor/helper');

async.someSeries(['1','2','3'],helper.consoleFunc,function(err,result) {                      //进入1
  console.log('得到' + result + '结果');                                                        //得到true结果
});                                                                                           
                                                                                              

async.someSeries(['1','2','3'],helper.consoleAsnyc,function(err,result) {                    //1
  console.log('得到' + result + '结果');                                                       //进入1
});                                                                                           //得到true结果                                                                                              