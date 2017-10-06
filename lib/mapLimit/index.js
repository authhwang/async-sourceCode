const helper = require('../../vendor/helper');
const async = require('async');

async.mapLimit(['1','2','3'],2,helper.consoleFunc,function(err,result){         //进入1
  console.log('得到' + result + '结果');                                            //进入2
});                                                                               //进入3
                                                                                  //得到1,2,3个结果

async.mapLimit(['1','2','3'],2,helper.consoleAsnyc,function(err,result){      //1
  console.log('得到' + result + '结果');                                          //2
});                                                                             //进入1
                                                                                //3
                                                                                //进入2
                                                                                //进入3
                                                                                //得到1,2,3个结果