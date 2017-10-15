const async = require('async');
const helper = require('../../vendor/helper');

// async.applyEachSeries([helper.consoleFunc,helper.consoleAsnyc],'1',function(err,result){          //进入1
//     console.log('得到结果:' + result);                                                             //1
// });                                                                                              //进入1
//                                                                                                 //得到结果: 1,1
async.eachSeries(['1','2'],async.applyEach([helper.consoleFunc,helper.consoleAsnyc]),function(err,result){       //进入1 -- not async
    console.log('得到结果' + result);                                                                             //1
});                                                                                                             //进入1 -- async
                                                                                                                //进入2 -- not async
                                                                                                                //2
                                                                                                                //进入2  -- async
                                                                                                                //得到结果 undefined