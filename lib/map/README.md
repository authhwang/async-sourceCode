# map

### map(coll, iteratee, callback)

之前groupBy有用过这个map函数 用了eachOf做循环函数即会判断是否array来决定循环体 然后在循环逻辑上只是单纯在得到的值放在一个数组中 在最初的callback上返回该数组而已

以此为例

```javascript
async.map(['file1','file2','file3'], fs.stat, function(err, results) {
    // results is now an array of stats for each file
});
```

## map函数

map函数是由`export default doParallel(map);`组成

其中`doparallel`函数就是调用`map`函数 而这个map函数是internal文件夹上的 所以主要看`map`函数

## map函数(internal文件夹)

```javascript
export default function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;
    var _iteratee = wrapAsync(iteratee);

    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        _iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}
```

😂基本上不用解释也应该会懂 所以就不做多的分析了