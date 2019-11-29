import returnElementByPath from '../utils/returnElementByPath';
import { isInWindowAndVisible } from '../actions/elementIsVisible';

const MouseEventPolyfill = (eventType, params) => {
    params = params || { bubbles: false, cancelable: false };
    let mouseEvent = document.createEvent('MouseEvent');
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



const clickElement = (data) => {
    try {
        const el = returnElementByPath(data.element);
        if (el === undefined) return 'ko';
        const rect = el.getBoundingClientRect(),
            xPos = rect.left,
            yPos = rect.top;

        const isClickable = isInWindowAndVisible(el);
        if (!isClickable) return 'ko';
        simulateMouseEvent(el, 'mousemove');
        simulateMouseEvent(el, 'click');
        return 'ok';
    } catch (e) {
        throw e;
    }
};

const simulateMouseEvent = (myTarget, evt) => {
    try {
        const event = new MouseEvent(evt, {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        myTarget.dispatchEvent(event);
    } catch (e) {
        try {
            const event = new MouseEventPolyfill(evt, {
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
