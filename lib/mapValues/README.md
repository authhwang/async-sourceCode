# mapValues

### mapValues(obj, iteratee, callback)

跟map的用法是差不多的 只不过是针对对象用 当然在逻辑上跟循环函数会和map不同 这里用的循环函数是eachOfLimit 就是用while循环体 至于循环逻辑上是用创建一个新的对象 用iteratee所提供的key对应通过callback而获得value 最后在最初的callback上返回该对象  主要就是调用mapValueLimit 所以看这个即可

## mapValueLimit函数

```javascript
export default function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};
    var _iteratee = wrapAsync(iteratee)
    //
    eachOfLimit(obj, limit, function(val, key, next) {
        _iteratee(val, key, function (err, result) {
            if (err) return next(err);
            //用iteratee所提供的key result就是回调提供的值
            newObj[key] = result;
            next();
        });
      //返回该obj
    }, function (err) {
        callback(err, newObj);
    });
}
```

