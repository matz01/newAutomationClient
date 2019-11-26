import returnElementByPath from '../utils/returnElementByPath';
import {isInWindowAndVisible} from '../actions/elementIsVisible';

const clickElement = (data) => {
    try {
        const el = returnElementByPath(data.element)
        if (el === undefined) return 'ko';
        const rect = el.getBoundingClientRect(),
            xPos = rect.left,
            yPos = rect.top;
        const isClickable = isInWindowAndVisible(el);
        if(!isClickable) return 'ko';
        document.elementFromPoint(xPos, yPos).click();
        simulateMouseover(el)
        return 'ok';
    } catch (e) {
        throw e;
    }
}

const simulateMouseover = (myTarget) => {
    const event = new MouseEvent('mousemove', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    const canceled = !myTarget.dispatchEvent(event);
    if (canceled) {
        // A handler called preventDefault.
    } else {
        // None of the handlers called preventDefault.
    }
}



export default clickElement;
