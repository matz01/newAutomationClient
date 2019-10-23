import get from 'lodash/get';
import elementAttribute from './elementAttribute';
import { displayLog } from './doDisplay';

const elementByPath = (path) => {
    const el = document.querySelectorAll(path) || []
    return el.length > 0
}

export default elementByPath;
