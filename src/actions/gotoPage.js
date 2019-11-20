import { displayLog } from '../utils/doDisplay';

const gotoPage = (data) => {
    try {
        displayLog("##", `href: ${window.location.href}`)
        window.location.hash = data.url;
        return 'ok';
    } catch (e) {
        return 'ko';
    }
};

export default gotoPage;
