import { isEmpty, get } from 'lodash';
import checkElementByPath from '../utils/checkElementByPath';

const clickElement = (data) => {
    try {
        const el = checkElementByPath(data.element)
        el.click()
        return 'ok';
    } catch (e) {
        throw e
    }
}

export default clickElement;
