# every

#### every(coll, iteratee, callback)

整体上跟detect很相似 不过在判断的地方会有不同 every是判断每一个 假如true则继续 false则调用callback 在createTester上处理的逻辑会有不同

以此为例

```javascript
async.every(['file1','file2','file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, result) {
    // if result is true then every file exists
});
```

## every函数

every函数是由`doParallel(createTester(notId, notId));`组成

其中`notId`就是一个将传进去的第一个参数隐式转换成bool值并取反返回 这个函数在之后的判断起了决定性的作用

后面的就跟detect一样 直接跳到createTester来讲就行

## createTester函数

```javascript
export default function _createTester(check, getResult) {
    return function(eachfn, arr, iteratee, cb) {
        cb = cb || noop;
        var testPassed = false;
        var testResult;
        eachfn(arr, function(value, _, callback) {
            iteratee(value, function(err, result) {
                if (err) {
                    callback(err);
                  //走1
                } else if (check(result) && !testResult) {
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop);
                  //走2
                } else {
                    callback();
                }
            });
        }, function(err) {
            if (err) {
                cb(err);
            } else {
                cb(null, testPassed ? testResult : getResult(false));
            }
        });
    };
}
```

假如是循环到是正确的值时就会走2 因为在check(result)上得到的是false 假如有一个是false就会走1 因为走1了所以就可以直接调用最初的callback 不过循环假如还有的话还会继续 所以假如是true就会走2 false会走1 可是最初callback已经调用过所以会被销毁了