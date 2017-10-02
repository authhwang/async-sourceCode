# eachLimit

#### eachLimit(coll, limit, iteratee, callback)

直接用了while那个循环做的 同步或异步的效果跟detectLimit一样 然后跟each一样直接调用iteratee

代码如下:

```javascript
export default function eachLimit(coll, limit, iteratee, callback) {
    eachOfLimit(limit)(coll, withoutIndex(wrapAsync(iteratee)), callback);
}
```



