const helper = require('../../vendor/helper');
const async = require('async');

async.everyLimit(['1','2','3'],2,helper.consoleFunc,function(err,result){       //进入1
  console.log('完成'+ result+ '个方法');                                         //进入2
});                                                                            //进入3
                                                                               //完成true个方法

async.everyLimit(['1','2','3'],2,helper.consoleAsnyc,function(err,result){     //1
  console.log('完成'+ result+ '个方法');                                        //2
});                                                                           //进入1
                                                                              //3
                                                                              //进入2
                                                                              //进入3
                                                                              //true