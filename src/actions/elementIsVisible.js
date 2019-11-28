import checkElementByPath from '../utils/checkElementByPath';
import { displayLog } from '../utils/doDisplay';
import returnElementByPath from '../utils/returnElementByPath';

export const isInWindowAndVisible = (elem) => {
    try {
        const style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0) {
            return false;
        }
        const elemCenter = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
        let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        do {
            if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
        return false;
    } catch (e) {
        throw e;
    }
};

const elementIsVisible = (data, timeout = 20) => {
    let iterate;
    try {
        let iteration = 0;
        return new Promise(resolve => {
            iterate = setInterval(() => {
                try {
                    const el = returnElementByPath(data.element);
                    if (el !== undefined) {
                        if(isInWindowAndVisible(el)){
                            clearInterval(iterate);
                            resolve("ok");
                        }
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


export default elementIsVisible;
