# groupBy

### groupBy(coll, iteratee, callbackopt)

这个函数主要是会传一个对象 相同的值就放一起 并有对应的键放在一起 主要看groupByLimit这个函数就行 是用while做为循环体

 ## groupBy函数

groupBy函数是由`export default doLimit(groupByLimit, Infinity);`组成

`doLimit`也只是调用`groupByLimit`这个函数的 所以主要看`groupByLimit`函数

## groupByLimit函数

```javascript
export default function(coll, limit, iteratee, callback) {
    callback = callback || noop;
    var _iteratee = wrapAsync(iteratee);
  							//iteratee返回值是对象{key: key, val: val}
    mapLimit(coll, limit, function(val, callback) {
        _iteratee(val, function(err, key) {
            if (err) return callback(err);
            return callback(null, {key: key, val: val});
        });
      //mapResult就是在用mapLimit时得到的值数组
    }, function(err, mapResults) {
        var result = {};
        // from MDN, handle object having an `hasOwnProperty` prop	
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        for (var i = 0; i < mapResults.length; i++) {
            //遍历数组 假如有值则取出key和value 然后判断result对象是否已拥用该key 有则推入该key下的数组 无则在该key下开个新数组
            if (mapResults[i]) {
                var key = mapResults[i].key;
                var val = mapResults[i].val;

                if (hasOwnProperty.call(result, key)) {
                    result[key].push(val);
                } else {
                    result[key] = [val];
                }
            }
        }

        return callback(err, result);
    });
};
```

其中mapLimit就是一个走while循环体系和循环体回调和总回调的三兄弟函数 只不过mapLimit的iteratee回调是得到值就存在数组中 groupByLimit只是在mapLimit下加多一层逻辑而已