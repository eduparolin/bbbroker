function retry(f, delay = 250, maxAttempts = 10, attempt = 0, error = new Error()) {
    if (attempt > maxAttempts) {
        return Promise.reject(error);
    }
    return f()
        .catch(async (err) => {
            await wait(delay);
            return retry(f, delay, maxAttempts, ++attempt, err);
        })
}

function wait(value) {
    return new Promise(resolve => {
        setTimeout(resolve, value);
    });
}

exports.retry = retry;