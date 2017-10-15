# applyEach

### applyEach(fns, …args, callback)

applyEach作为控制流函数来说 对于之前的函数 有不同的地方 在于他可以有不同的用法 一个是做为控制流 将循环一个函数数组 将（...args）作为参数放在函数中 假如都调用完则调用callback 另一个用法是当作一个函数（只传一个参数） 成为结合性函数 然后用在之前的async函数上

先说第一种用法 以此为例

```javascript
async.applyEach([enableSearch, updateSchema], 'bucket', callback);
```

## applyEach函数

`export default applyEach(map);`要看internal里的`applyEach`

## applyEach函数 (internal文件夹)

```javascript
export default function applyEach(eachfn) {
    return function(fns/*, ...args*/) {
        //将第一个参数剔除
        var args = slice(arguments, 1);
        					  //回调1
        var go = initialParams(function(args, callback) {
            var that = this;
          	//eachfn就是map函数  cb是直接翻去map函数那边判断是否停止循环
            return eachfn(fns, function (fn, cb) {
                wrapAsync(fn).apply(that, args.concat(cb));
            }, callback);
        });
        //假如有回调 即不是只有一个参数
        if (args.length) {
            //调用go函数
            return go.apply(this, args);
        }
        //假如没回调 即只有一个参数
        else {
            //只返回一个函数
            return go;
        }
    };
}
```

调用go函数 即将传给go的参数传给回调1 在回调1里面就是调用map函数  循环fns函数数组 每一轮得到一个小函数 然后将args参数和map里面的cb传给小函数 并调用 循环完就会调用最初的callback

第二种用法 以此为例

```javascript
async.each(
    buckets,
    async.applyEach([enableSearch, updateSchema]),
    callback
);
```

这里的时候他由于只有一个参数 所以就等于平时的iteratee函数 想回之前each的处理 循环遍历coll 然后每一轮循环的时候就会将参数传入iteratee函数 也是直接传给fns数组上的每一个小函数的 不过他的优先度是 先each的第一轮 然后遍历applyEach的函数数组 遍历完再去each的第二轮 然后再到applyEach 由于each都调用最后时只给最初的callback传error参数 所以不能在callback上获得获得值数组(不过在applyEach上都会一直把值数组保存并往上传入 )