import checkElementByPath from '../utils/checkElementByPath';
import { displayLog } from '../utils/doDisplay';

const elementIsNotInPage = (data, timeout = 20) => {
    let iterate;
    try {
        let iteration = 0;
        return new Promise(resolve => {
            iterate = setInterval(() => {
                try {
                    const el = checkElementByPath(data.element);
                    if (!el) {
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

export default elementIsNotInPage;
