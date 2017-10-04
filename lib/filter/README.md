# filter

#### filter(coll, iteratee, callback)

通过iteratee获得的值并进行隐式转换成bool值来判断 假如为真就传进新数组中 在callback中返回

以此为例

```javascript
async.filter(['file1','file2','file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, results) {
    // results now equals an array of the existing files
});
```

## filter函数

filter函数是由`export default doParallel(filter);`组成

`doParaller`在之前有说过 是靠`eachof`做循环的 所以主要讲filter

## filter函数

```javascript
export default function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, wrapAsync(iteratee), callback || noop);
}
```

其中通过判断是否数组来调用相应的判断函数`filterArray`和`filterGeneric`

下面会一一解释

## filterArray函数 

```javascript
function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    //第二个是循环时对数组每个元素所调用的函数 会循环所有值
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
          	//强制转换成bool值 然后保存
            truthValues[index] = !!v;
            callback(err);
        });
      //循环完后并获得所有iteratee的回调会调用以下函数
    }, function (err) {
        if (err) return callback(err);
        var results = [];
        //通过循环去判断之前保存的bool数组 假如为真则将一开始的数组所对应值推入results中 
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i]) results.push(arr[i]);
        }
        //返回整个数组
        callback(null, results);
    });
}
```

##  filterGeneric函数

```javascript
//是对对象所适用
function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            } else {
                //假如是对象 则单纯判断 不需要强制转换
                if (v) {
              		//因为是对象 所以存入的值会不同
                    results.push({index: index, value: x});
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        } else {
                           //根据value去进行排序
            callback(null, arrayMap(results.sort(function (a, b) {
                return a.index - b.index;
            }), property('value')));
        }
    });
}
```

