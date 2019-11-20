const checkElementByPath = (path) => {
    try {
        let el = undefined;
        if (path.search(/\[/g) === -1) {
            el = document.querySelectorAll(`*[id=${path}]`) || [];
        } else {
            el = document.querySelectorAll(path) || [];
        }
        return el.length > 0
    } catch (e) {
        throw e
    }
}

export default checkElementByPath;
