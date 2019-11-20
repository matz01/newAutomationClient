import get from 'lodash/get';
import { displayLog } from '../utils/doDisplay';

const countElement = (data) => {
    try {
        const el = document.querySelectorAll(data.element);
        return el.length;
    } catch (e) {
        throw e
    }
};

export default countElement;
