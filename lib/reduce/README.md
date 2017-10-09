# reduce

### reduce(coll, memo, iteratee, callback)

reduce主要是进行累加的操作 具体操作在代码上分析 循环体是while 不过并发次数为1 iteratee的参数是memo item callback

## reduce函数

```javascript
export default function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);
    var _iteratee = wrapAsync(iteratee);
    eachOfSeries(coll, function(x, i, callback) {
        
        _iteratee(memo, x, function(err, v) {
          //更新每次从回调上获取的value 并放在memo上 然后又传给下一个iteratee 这就是为啥会累加的原因
            memo = v;
            callback(err);
        });
    }, function(err) {
        callback(err, memo);
    });
}
```

