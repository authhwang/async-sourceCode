const helper = require('../../vendor/helper');
const async = require('async');

async.mapValuesLimit({'1': '1','2': '2','3': '3'},2,helper.consoleFuncForObj,function(err,result){            //进入键为1值为1方法
  console.log('得到结果为', result);                                                                           //进入键为2值为2方法
});                                                                                                         //进入键为3值为3方法
                                                                                                            //得到结果为 { '1': '1', '2': '2', '3': '3' }
                                                                                                      
async.mapValuesLimit({'1': '1','2': '2','3': '3'},2,helper.consoleAsnycForObj,function(err,result){           //键为1值为1
  console.log('得到结果为', result);                                                                            //键为2值为2
});                                                                                                           //进入键为1值为1方法
                                                                                                              //键为3值为3
                                                                                                              //进入键为2值为2方法
                                                                                                              //进入键为3值为3方法
                                                                                                              ////得到结果为 { '1': '1', '2': '2', '3': '3' }                                                           