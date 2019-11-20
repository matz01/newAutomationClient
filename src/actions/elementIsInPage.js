import { isEmpty, get } from 'lodash';
import elementAttribute from '../utils/elementAttribute';
import checkElementByPath from '../utils/checkElementByPath';
import delay from '../utils/delay';
import { displayLog } from '../utils/doDisplay';

const elementIsInPage = (data, timeout = 20) => {
    let iterate;
    try {
        let iteration = 0;
        return new Promise(resolve => {
            iterate = setInterval(() => {
                try {
                    const el = checkElementByPath(data.element);
                    if (el) {
                        clearInterval(iterate);
                        resolve("ok");
                    }
                } catch (e) {
                    clearInterval(iterate);
                    displayLog('!!', `error: ${e}`);
                    return new Promise((resolve, reject) => {
                        resolve('ko');
                    });
                }
                if (iteration === 10) {
                    resolve("ko");
                    clearInterval(iterate);
                }
                iteration++;
            }, 1500);
        });
    } catch (e) {
        clearInterval(iterate);
        displayLog('!!', `error: ${e}`);
        return new Promise((resolve, reject) => {
            resolve('ko');
        });
    }
};

export default elementIsInPage;
