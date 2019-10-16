import { isEmpty, get } from 'lodash';
import elementByPath from '../utils/elementByPath';

const clickElement = (data) => {
    try {
        const el = elementByPath(data.element)
        el.click()
        return 'ok';
    } catch (e) {
        return 'ko'
    }
}

export default clickElement;
