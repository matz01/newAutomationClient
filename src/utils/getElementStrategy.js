const getElementStrategy = (path) => {
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

export default getElementStrategy;
