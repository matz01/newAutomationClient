import { isEmpty, get } from 'lodash';
import elementAttribute from '../utils/elementAttribute';
import elementByPath from '../utils/elementByPath';
import delay from '../utils/delay';
import { displayLog } from '../utils/doDisplay';

const elementIsInPage = async (data, timeout = 10) => {
    try {
        let res = 'ko';
        for (let a = 0; a < timeout; a++) {
            const el = elementByPath(data.element);
            if (!isEmpty(el)) {
                res = 'ok';
                break;
            } else await delay(1000); // then the created Promise can be awaited
        }
        return res;
    } catch (e) {
        return 'ko';
    }
};

export default elementIsInPage;
