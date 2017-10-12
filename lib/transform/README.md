# transform

### transform(coll, accumulator, iteratee, callback)

一个跟reduce有点类似 但没reduce有限制的函数 accumulator是一个用来判断是数组还是对象 可以不传

以此为例

```javascript
async.transform([1,2,3], function(acc, item, index, callback) {
    // pointless async:
    process.nextTick(function() {
        //这里就是你想做的计算逻辑 
        acc.push(item * 2)
        callback(null)
    });
}, function(err, result) {
    // result is now equal to [2, 4, 6]
});
```



## transform函数

```javascript
export default function transform (coll, accumulator, iteratee, callback) {
    //假如没传accumulator则通过coll去判断
    if (arguments.length <= 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = isArray(coll) ? [] : {};
    }
    callback = once(callback || noop);
    var _iteratee = wrapAsync(iteratee);
	//其实整个计算过程都是在iteratee里面完成 并把值自己去传进accumulator
    eachOf(coll, function(v, k, cb) {
        //这里的cb是直接把eachof对循环停止的判断回调传了出来 所以对于这个callback不需要把值传进去
        _iteratee(accumulator, v, k, cb);
    }, function(err) {
        callback(err, accumulator);
    });
}
```

