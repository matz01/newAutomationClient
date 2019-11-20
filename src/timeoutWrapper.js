import unfetch from 'unfetch';

const timeoutWrapper = (url, options, timeout) => {
    return new Promise((resolve, reject) => {
        let timeoutId = undefined;
        if (timeout) {
            const e = {code: 'GENERIC_TIMEOUT'}
            timeoutId = setTimeout(() => {return reject(e)}, timeout, e)
        }
        unfetch(url, options).then(
            (response) => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
                return resolve(response)
            }).catch(
            (err) => {
                console.log(err);
                return reject(err)
            }
        )
    })
}

export default timeoutWrapper
