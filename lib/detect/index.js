const helper = require('../../vendor/helper.js');
const async = require('async');
const identity = require('lodash/identity');

async.detect(['1','2','3'],helper.consoleFunc,function(err, result){     //进入1
  console.log('完成第' + result + '个方法');                               //完成第1个方法
});                                                                      //进入2
                                                                         //进入3
