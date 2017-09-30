# detect

### detect(coll, iteratee, callback)

iteratee是含有过滤的功能 假如其中有一个判断为true 则直接调用callback（但循环继续处理） 而且只会调用一次 调用为则销毁callback 

以此为例

```javascript
async.detect(['file1','file2','file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, result) {
    // result now equals the first file in the list that exists
});
```

## detect函数

detect函数是由`doParallel(createTester(identity, findGetResult));`组成

其中 `idtentity（）`是一个返回它所接收的第一个参数 假如是false也会返回false

`findGetResult()`是一个返回它所接收的第二个参数

## doParallel函数

```javascript
function doParallel(fn) {
  return function (obj, iteratee, callback) {
      return fn(eachOf, obj, wrapAsync(iteratee), callback);
  };
}
```

也是老套路 将`createTester()`封装 然后将coll, iteratee, callback传入其中

eachof的代码组成

```javascript
//用于类似数组中 （参照lodash的方法）
function eachOfArrayLike(coll, iteratee, callback) {
  	//销毁callback的引用 让它只能用一次
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }
	//判断是否已经循环结束或者遇到有返回true的 有则直接调用createTester的图二
    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if ((++completed === length) || value === breakLoop) {
          	//假如已经调用过 下次循环完再进入的时候都已经被销毁了
            callback(null);
        }
    }
	//循环 一个一个执行 调用createTester的图一
    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}
//用于对象 在concat有分析过
var eachOfGeneric = doLimit(eachOfLimit, Infinity);

export default function(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
```

##  createTester函数

createTester的代码组成

```javascript
export default function _createTester(check, getResult) {
    return function(eachfn, arr, iteratee, cb) {
        cb = cb || noop;
        var testPassed = false;
        var testResult;
       //这里的就是调用上面的eachof所返回的函数
        eachfn(arr, function(value, _, callback) {
 			
            iteratee(value, function(err, result) {
                if (err) {
                    callback(err);
                } else if (check(result) && !testResult) { //判断bool值 testResult是判断之前有没有再已经是true的值
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop);
                } else { //bool值是false就会到这里
                    callback();
                }
            });
        }, function(err) {
            if (err) {
              	//这里的cb就是最初的callback
                cb(err);
            } else {
                //有获得第一个true的值就返回 没有就返回undefind
                cb(null, testPassed ? testResult : getResult(false));
            }
        });
    };
```

图一如下:

```javascript
function(value, _, callback) {
 	iteratee(value, function(err, result) {
        if (err) {
           callback(err);
        } else if (check(result) && !testResult) { //判断bool值 testResult是判断之前有没有再已经是true的值
           testPassed = true;
           testResult = getResult(true, value);
           callback(null, breakLoop);
         } else { //bool值是false就会到这里
           callback();
         }
     });
}
```

图二如下:

```javascript
 function(err) {
   if (err) {
      //这里的cb就是最初的callback
       cb(err);
      } else {
       //有获得第一个true的值就返回 没有就返回undefind
       cb(null, testPassed ? testResult : getResult(false));
      }
 }
```

