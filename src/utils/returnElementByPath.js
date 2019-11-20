import getElementStrategy from '../utils/getElementStrategy';

const returnElementByPath = (path) => {
    try {
        const elementList = getElementStrategy(path);
        return elementList[0];
    } catch (e) {
        throw e;
    }
}

export default returnElementByPath;
