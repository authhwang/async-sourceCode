const helper = require('../../vendor/helper.js');
const async = require('async');

async.eachOfSeries(['1','2','3'],2,helper.consoleFunc,function(err){   //进入1
  console.log('完成所有方法');                                           //进入2
});                                                                    //进入3
                                                                       //完成

async.eachOfSeries(['1','2','3'],2,helper.consoleAsnyc,function(err){  //1
  console.log('完成所有方法');                                           //进入1
});                                                                    //2
                                                                       //进入2
                                                                       //3
                                                                       //进入3
                                                                       //完成