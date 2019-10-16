import get from 'lodash/get';
import elementAttribute from './elementAttribute';

const elementByPath = (path) => {
    const el = document.querySelectorAll(path);
    return get(el, '0')
}

export default elementByPath;
