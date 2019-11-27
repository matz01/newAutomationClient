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
            return {
                singleElement: el[0],
                elementsLength: el.length,
            };
        }
        const xElList = document.evaluate( path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
        const singleEl = document.evaluate( path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
        return {
            singleElement: get(singleEl, 'singleNodeValue'),
            elementsLength: get(xElList, 'snapshotLength', 0),
        };
    } catch (e) {
        throw e
    }
}



export default getElementStrategy;
