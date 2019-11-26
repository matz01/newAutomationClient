import get from 'lodash/get';
import returnElementByPath from '../utils/returnElementByPath';

const getText = (data) => {
    try {
        const el = returnElementByPath(data.element);
        return get(el, 'textContent');
    } catch (e) {
        throw e;
    }
};

export default getText;
