import elementByPath from '../utils/elementByPath';
import devicesKeyMap from '../utils/devices/devicesKeyMap';
import { displayLog } from '../utils/doDisplay';

const pressKey = (device, keyCode) => {
    try {
        displayLog(`(pressKey code: ${devicesKeyMap[device][keyCode]})`);
        const logKey = {
            bubbles : false,
            cancelable : true,
            keyCode : devicesKeyMap[device][keyCode]
        };
        const down = new KeyboardEvent("keydown", logKey);
        const up = new KeyboardEvent("keyup", logKey);
        document.body.dispatchEvent(down);
        document.body.dispatchEvent(up);
        return 'ok';
    } catch (e) {
        return 'ko'
    }
}

export default pressKey;
