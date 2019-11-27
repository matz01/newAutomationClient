import getElementStrategy from '../utils/getElementStrategy';

const countElement = (data) => {
    try {
        const elementList = getElementStrategy(data.element);
        return elementList.elementsLength;
    } catch (e) {
        throw e
    }
};

export default countElement;
