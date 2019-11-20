import get from 'lodash/get';
import { displayLog } from '../utils/doDisplay';

const getSource = (data) => {
    try {
        const el = document.querySelectorAll(data.element);
        console.log(data.element, el)
        return get(el, '0.outerHTML');
    } catch (e) {
        throw e
    }
};

export default getSource;
