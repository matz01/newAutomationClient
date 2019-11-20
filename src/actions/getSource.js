import get from 'lodash/get';
import returnElementByPath from '../utils/returnElementByPath';

const getSource = (data) => {
    try {
        const el = returnElementByPath(data.element);
        return get(el, 'outerHTML');
    } catch (e) {
        throw e;
    }
};

export default getSource;
