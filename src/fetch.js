import get from 'lodash/get';
import timeoutWrapper from './timeoutWrapper';

const fetch = async (url, options) => {
    try {
        const fetchResponse = await timeoutWrapper(url, options, get(options, 'timeout') || 10000);
        return Promise.resolve(fetchResponse);
    } catch (e) {
        throw e
    }
};

export default fetch;
