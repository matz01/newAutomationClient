import get from 'lodash/get';

const xgetElementStrategy = (path) => {
    try {
        let el = undefined;
        if (path.search(/\[/g) === -1) {
            el = document.querySelectorAll(`*[id=${path}]`) || [];
        } else {
            el = document.querySelectorAll(path) || [];
        }
        return el
    } catch (e) {
        throw e
    }
}

const getElementStrategy = (path) => {
    try {
        if (path.search(/\[/g) === -1) {
            const el = document.querySelectorAll(`*[id=${path}]`) || [];
            return el[0];
        }
        const xEl = document.evaluate( path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
        console.log('.....', xEl)
        return get(xEl, 'singleNodeValue');
    } catch (e) {
        throw e
    }
}



export default getElementStrategy;
