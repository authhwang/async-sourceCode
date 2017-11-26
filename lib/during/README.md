# during

像是每次遍历运行fn函数 然后会用test函数测试一下 假如test成功则调用第三个参数callback 就像它的名字一样 在...期间

以此为例

```javascript
var count = 0;

async.during(
    function (callback) {
        return callback(null, count < 5);
    },
    function (callback) {
        count++;
        setTimeout(callback, 1000);
    },
    function (err) {
        // 5 seconds have passed
    }
);
```



## during

```javascript
export default function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);
    var _fn = wrapAsync(fn);
    var _test = wrapAsync(test);

    function next(err) {
        if (err) return callback(err);
        _test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        _fn(next);
    }

    _test(check);
}
```

其实整个也是很简单看懂 整个逻辑就是test() -> check() -> fn() -> next() -> test() 换成语义化就是判断 -> 检查 -> 执行 -> 下一个 -> 判断 当检查判断为false时就会调用第三个callback