# sortBy

### sortBy(coll, iteratee, callback)

它是用map函数做循环函数上再加上一层逻辑 map也是用doParallel函数的 所以也是for或者while做循环体 在那一层代码逻辑上再作分析

以此为例

```javascript
// ascending order
async.sortBy([1,9,3,5], function(x, callback) {
    callback(null, x);
}, function(err,result) {
    // result callback
});

```

 

## sortBy函数

```javascript
export default function sortBy (coll, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    map(coll, function (x, callback) {
        //criteria 就是你返回给他的判断值
        _iteratee(x, function (err, criteria) {
            if (err) return callback(err);
            callback(null, {value: x, criteria: criteria});
        });
    }, function (err, results) {
        if (err) return callback(err);
      	//这里要拉出来解释
        callback(null, arrayMap(results.sort(comparator), property('value')));
    });
	//从这里看出整个默认是升势
    function comparator(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}
```

其中arrayMap 是一个会根据第二参数而遍历第一参数 获取以第二参数为键的值

results.sort(comparator)就是用下面的compartor先进行排序 排序后就通过arrayMap去取值 并放在一个数组中 至于property('value') 可以看做指明要需要获取的键