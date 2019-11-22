import returnElementByPath from '../utils/returnElementByPath';

const clickElement = (data) => {
    try {
        const el = returnElementByPath(data.element)
        const xPos = el.offsetLeft;
        const yPos = el.offsetHeight;
        console.log(document.elementFromPoint(xPos, yPos))
        document.elementFromPoint(xPos, yPos).click();
        return 'ok';
    } catch (e) {
        throw e
    }
}

export default clickElement;
