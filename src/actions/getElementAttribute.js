import get from 'lodash/get';
import returnElementByPath from '../utils/returnElementByPath';

const getElementAttribute = (data) => {
    try {
        const el = returnElementByPath(data.element);
        const attr = el.getAttribute(data.attributeKey);
        return attr;
    } catch (e) {
        throw e;
    }
};

export default getElementAttribute;
