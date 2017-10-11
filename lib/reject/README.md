# reject

### reject(coll, iteratee, callback)

`rejcet`在逻辑处理上跟`filter`是相反的 然而代理处理上只是在`filter`上加多一个层而已

以此为例

```javascript
async.reject(['file1','file2','file3'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, results) {
    // results now equals an array of missing files
    createFiles(results);
});
```

## reject函数

reject函数的组成如下`export default doParallel(reject);`

`doParallel`只是调用`reject`所以直接看`reject` 循环函数是`eachof` 即有可能是while 也有可能for

## reject函数(在internal文件夹)

```javascript
export default function reject(eachfn, arr, iteratee, callback) {
    
  filter(eachfn, arr, function(value, cb) {
        iteratee(value, function(err, v) {
            //这个cb就是图一 !v就是所有值取反 在filter才可以将false的加入result数组中
            cb(err, !v);
        });
    }, callback);
}
```

图一：

```javascript
function (err, v) {
     truthValues[index] = !!v;
     //下面的callback就是去到eachof上的 就不再解析啦
     callback(err);
});
```

换句话说就是filter上的iteratee会调用到internal中reject 然后里面再调用最初的iteratee