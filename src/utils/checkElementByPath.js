import getElementStrategy from '../utils/getElementStrategy';

const checkElementByPath = (path) => {
    try {
        try {
            const elementList = getElementStrategy(path);
            return elementList.length > 0
        } catch (e) {
            throw e;
        }
    } catch (e) {
        throw e
    }
}

export default checkElementByPath;
