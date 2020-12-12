(function(w) {
    function Promise(excutor) {
        const self = this
        const PINDING = 'pinding'
        this.status = PINDING
        this.data = undefined
        this.callbackes = []

        function resolve(value) {
            self.status = 'resolved'
            self.data = value
            if (self.status !== PINDING) return
            setTimeout(() => {
                if (self.callbackes.length > 0) {
                    self.callbackes.forEach(n => {
                        n.onResolved(value)
                    })
                }
            })
        }

        function reject(reason) {
            this.status = 'rejected',
                this.data = reason
            if (this.status !== PINDING) return
            setTimeout(() => {
                this.callbackes.forEach(n => {
                    n.onRejected(reason)
                })
            })
        }

        function reject(reason) {}
        excutor(resolve, reject)
    }
    Promise.prototype.then = function(onResolved, onRejected) {
        return new Promise(function(resolve, reject) {
            function handle(method) {
                let result = method(value)
                try {
                    if (result instanceof Promise) {
                        result.then(resolve, reject)
                    } else {
                        resolve(values)
                    }
                } catch (err) {
                    reject(err)
                }
            }
            if (this.status == 'resolved') {
                handle(onResolved)

            } else if (this.status == 'rejected') {
                handle(onRejected)
            } else {
                this.callbackes.push({
                    onResolved() {
                        handle(onResolved)
                    },
                    onRejected() {
                        handle(onRejected)
                    }
                })
            }
        })
    }
}(window))