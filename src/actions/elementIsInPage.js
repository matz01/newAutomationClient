import { isEmpty, get } from 'lodash';
import elementAttribute from '../utils/elementAttribute';
import elementByPath from '../utils/elementByPath';
import delay from '../utils/delay';
import { displayLog } from '../utils/doDisplay';

const elementIsInPage = (data, timeout = 10) => {
    let iteration = 0;
    return new Promise(resolve => {
        const iterate = setInterval(() => {
            const el = elementByPath(data.element);
            if (el) {
                clearInterval(iterate)
                resolve("ok");
            }
            if(iteration === 10){
                resolve("ko");
                clearInterval(iterate)
            }
            iteration ++;
        }, 1000)
    });
};

export default elementIsInPage;
