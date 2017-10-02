const helper = require('../../vendor/helper.js');
const async = require('async');

async.each(['1','2','3'],helper.consoleFunc,function(err){             //进入1
  console.log('完成所有方法');                                           //进入2
});                                                                    //进入3
                                                                       //完成

async.each(['1','2','3'],helper.consoleAsnyc,function(err){            //1
  console.log('完成所有方法');                                           //2
});                                                                    //3
                                                                       //进入1
                                                                       //进入2
                                                                       //进入3
                                                                       //完成