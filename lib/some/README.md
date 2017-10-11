# some

### some(coll, iteratee, callback)

跟every一样都是用createTester判断 但判断条件不同的是 some在调用数组时假如有一个元素通过iteratee调用后返回true 则直接调用callback 即遇到true则调用callback 

以此为例:

```javascript
async.some(['file1','file2','file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, result) {
    // if result is true then at least one of the files exists
});
```



## some函数

some函数是以`export default doParallel(createTester(Boolean, identity));`组成

Boolean是指`Boolean()`将数组元素强转为Bool 这个是后面createrTester最为重要的点

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
           //在这里可以看出 假如有一值为true 就会直接调用callback(null,breakLoop)从而直接调用最初的callback 不过假如由于是for 所以会把剩下的循环继续 只不过不能再调用最初的callback而已 因为被销毁
                } else if (check(result) && !testResult) {
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop);
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

