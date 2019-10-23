import elementByPath from '../utils/elementByPath';
import crossBrowserKeyboardEvent from '../utils/crossBrowserKeyboardEvent';
import devicesKeyMap from '../utils/devices/devicesKeyMap';
import { displayLog } from '../utils/doDisplay';

const pressKey = (device, keyCode) => {
    try {
        displayLog(`(press key: ${keyCode} / ${devicesKeyMap[device][keyCode]})`)
        const logKey = {
            bubbles : false,
            cancelable : true,
            keyCode : devicesKeyMap[device][keyCode]
        };
        const down = crossBrowserKeyboardEvent("keydown", logKey)
        document.body.dispatchEvent(down);
        return 'ok';
    } catch (e) {
        return 'ko';
    }
}

export default pressKey;
