const helper = require('../../vendor/helper');
const async = require('async');

async.everySeries(['1','2','3'],helper.consoleFunc,function(err,result){       //进入1
  console.log('完成'+ result+ '个方法');                                         //进入2
});                                                                            //进入3
                                                                               //完成true个方法

async.everySeries(['1','2','3'],helper.consoleAsnyc,function(err,result){     //1
  console.log('完成'+ result+ '个方法');                                        //进入1
});                                                                           //2
                                                                              //进入2
                                                                              //3
                                                                              //进入3
                                                                              //true