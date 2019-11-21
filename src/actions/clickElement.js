import returnElementByPath from '../utils/returnElementByPath';

const clickElement = (data) => {
    try {
        const el = returnElementByPath(data.element)
        el.click()
        return 'ok';
    } catch (e) {
        throw e
    }
}

export default clickElement;
