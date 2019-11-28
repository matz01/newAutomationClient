import returnElementByPath from '../utils/returnElementByPath';
import { isInWindowAndVisible } from '../actions/elementIsVisible';

const MouseEventPolyfill = (eventType, params) => {
    params = params || { bubbles: false, cancelable: false };
    var mouseEvent = document.createEvent('MouseEvent');
    mouseEvent.initMouseEvent(eventType,
        params.bubbles,
        params.cancelable,
        window,
        0,
        params.screenX || 0,
        params.screenY || 0,
        params.clientX || 0,
        params.clientY || 0,
        params.ctrlKey || false,
        params.altKey || false,
        params.shiftKey || false,
        params.metaKey || false,
        params.button || 0,
        params.relatedTarget || null
    );

    return mouseEvent;
};

const elementsFromPoint = (x, y) => {
    let parents = [];
    let parent = void 0;
    do {
        if (parent !== document.elementFromPoint(x, y)) {
            parent = document.elementFromPoint(x, y);
            parents.push(parent);
            parent.style.pointerEvents = 'none';
        } else {
            parent = false;
        }
    } while (parent);
    parents.forEach(function (parent) {
        return parent.style.pointerEvents = 'all';
    });
    return parents;
}

const clickElement = (data) => {
    try {
        const el = returnElementByPath(data.element);
        if (el === undefined) return 'ko';
        const rect = el.getBoundingClientRect(),
            xPos = rect.left,
            yPos = rect.top;
        const isClickable = isInWindowAndVisible(el);
        if (!isClickable) return 'ko';




        if (typeof document !== 'undefined' && typeof document.elementsFromPoint === 'undefined') {
            elementsFromPoint(xPos, yPos).click();
        } else {
            document.elementFromPoint(xPos, yPos).click();
        }

        simulateMouseover(el);
        return 'ok';
    } catch (e) {
        throw e;
    }
};

const simulateMouseover = (myTarget) => {
    try {
        const event = new MouseEvent('mousemove', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        myTarget.dispatchEvent(event);
    } catch (e) {
        try {
            const event = new MouseEventPolyfill('mousemove', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            myTarget.dispatchEvent(event);
        } catch (e) {
            throw e;
        }
    }
};


export default clickElement;
