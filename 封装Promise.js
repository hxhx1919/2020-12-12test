(function(w) {
    function Promise(excutor) {
        const self = this
        const PINDING = 'pending'
        self.status = PINDING
        self.data = undefined
        self.callbackes = []

        function resolve(value) {
            if (self.status != 'pending') return
            self.status = 'resolved'
            self.data = value
            setTimeout(() => {
                if (self.callbackes.length > 0) {
                    self.callbackes.forEach(n => {
                        n.onResolved(value)
                    });
                }
            })
        }

        function reject(reason) {
            if (self.status != 'pending') return
            self.status = 'rejected'
            self.data = reason
            setTimeout(() => {
                if (self.callbackes.length > 0) {
                    self.callbackes.forEach(n => {
                        n.onRejected(reason)
                    });
                }
            })
        }
        try { excutor(resolve, reject) } catch (error) {
            reject(error)
        }
    }
    Promise.prototype.then = function(onResolved, onRejected) {
        const self = this
        onResolved = typeof onResolved == 'function' ? onResolved : value => value
        onRejected = typeof onRejected == 'function' ? onRejected : reason => { throw reason }
        return new Promise(function(resolve, reject) {
            function handle(callback) {
                try {
                    const result = callback(self.data)
                    if (result instanceof Promise) {
                        result.then(value => resolve(value), reason => reject(reason))
                    } else {
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            if (self.status == 'resolved') {
                setTimeout(() => {
                    handle(onResolved)
                })
            } else if (self.status == 'rejected') {
                setTimeout(() => {
                    setTimeout(() => {

                        handle(onRejected)
                    })
                })
            } else {
                self.callbackes.push({
                    onResolved(value) {
                        handle(onResolved)
                    },
                    onRejected() {
                        handle(onRejected)
                    }
                })
            }
        })
    }
    Promise.prototype.catch = function(reject) {
        return this.then(undefined, reject)
    }
    Promise.resolve = function(value) {
        return new Promise(function(resolve, reject) {
            if (value instanceof Promise) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason)
        })
    }
    Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
            let num = 0
            let arr = []
            promises.forEach(function(n, i) {
                n.then(value => {
                    num++
                    arr.push(value)
                    if (num == promises.length) {
                        console.log(arr);
                    }
                }, reason => {
                    console.log(reason);
                    reject(reason)
                })
            })
        })
    }
    Promise.race = function(promises) {
        return new Promise(function(resolve, reject) {
            promises.forEach((n, i) => {
                n.then(resolve, reject)
            })
        })
    }
    w.Promise = Promise
}(window))