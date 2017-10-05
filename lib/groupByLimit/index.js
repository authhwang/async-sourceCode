const helper = require('../../vendor/helper');
const async = require('async');

async.groupByLimit(['1','2','3'],2,helper.consoleFunc,function(err,result){         //进入1
  console.log('得到' + result + '结果');                                            //进入2
});                                                                               //进入3
                                                                                  //得到{ '1': [ '1' ], '2': [ '2' ], '3': [ '3' ] }个结果

async.groupByLimit(['1','2','3'],2,helper.consoleAsnyc,function(err,result){      //1
  console.log('得到' + result + '结果');                                          //2
});                                                                             //进入1
                                                                                //3
                                                                                //进入2
                                                                                //进入3
                                                                                //得到{ '1': [ '1' ], '2': [ '2' ], '3': [ '3' ] }个结果