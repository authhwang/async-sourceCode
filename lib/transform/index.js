const async = require('async');
const helper = require('../../vendor/helper.js');

async.transform([1,2,3],helper.consoleFuncForTransform, function(err,result) {        //进入1
  console.log('得到结果为' + result);                                                  //进入2
});                                                                                  //进入3
                                                                                    //得到结果为2,4,6


async.transform([1,2,3],helper.consoleAsyncForTransform, function(err,result) {        //1
  console.log('得到结果为' + result);                                                  //2
});                                                                                  //3
                                                                                    //进入1
                                                                                    //进入2
                                                                                    //进入3
                                                                                    //得到结果为2,4,6                               
                              