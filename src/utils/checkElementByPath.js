import getElementStrategy from '../utils/getElementStrategy';

const checkElementByPath = (path) => {
    try {
        try {
            const elementList = getElementStrategy(path);
            return elementList !== undefined;
        } catch (e) {
            throw e;
        }
    } catch (e) {
        throw e
    }
}

export default checkElementByPath;
