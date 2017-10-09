# reduceRight

### reduceRight(array, memo, iteratee, callback)

只是将数组反转 还是用回reduce

## redeceRight函数

```javascript
export default function reduceRight (array, memo, iteratee, callback) {
    var reversed = slice(array).reverse();
    reduce(reversed, memo, iteratee, callback);
}
```

