# applyEachSeries

### applyEachSeries(fns, …args, callback)

不同的在于这里是用mapSeries 在调用逻辑上就会有大大的不同 之前的map是for做循环 所以当遇到有需要异步的时候 直接走下一个轮 可是对于while 由于限制了并发数 所以 会等空余并发数时才能调用下一轮 所以你可以看出 applyEachSeries只传一个参数（即作为一个iteraree函数的时）就会有不同的结果

