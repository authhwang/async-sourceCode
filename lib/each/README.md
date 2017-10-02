# each

#### each(coll, iteratee, callback)

跟detect有点相似 不过它没了对itreratee结果的回调判断 直接调用iteratee即可

以此为例

```javascript
async.each(openFiles, function(file, callback) {

    // Perform operation on file here.
    console.log('Processing file ' + file);

    if( file.length > 32 ) {
      console.log('This file name is too long');
      callback('File name too long');
    } else {
      // Do work to process file here
      console.log('File processed');
      callback();
    }
}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
});
```

## each函数

each函数是由

```javascript
export default function eachLimit(coll, iteratee, callback) {                                                                       	eachOf(coll, withoutIndex(wrapAsync(iteratee)), callback);                                                                 }
```

eachof在detect已经分析过 就是一个做循环的函数 

## withoutIndex

```javascript
export default function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}
```

就是一个直接调用iteratee的函数 只不过不传index而已