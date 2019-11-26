import getElementStrategy from '../utils/getElementStrategy';

const returnElementByPath = (path) => {
    try {
        const el = getElementStrategy(path);
        return el;
    } catch (e) {
        throw e;
    }
}

export default returnElementByPath;
