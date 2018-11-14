class Mocker {
    static shallResolve(resolution='resolve', time) {
        if(!time) {
            time = Math.random()*1000;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(resolution);
            }, time);
        })
    }

    static shallReject(rejection='reject', time) {
        if(!time) {
            time = Math.random()*1000;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(rejection);
            }, time);
        })
    }
}

module.exports = Mocker;