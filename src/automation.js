import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import createConsole, {
    toggleMainConsole,
    toggleMinimizedConsole
} from './utils/createConsole';

import getCookieByName from './utils/getCookieByName';
import {
    displayId,
    displayLog,
} from './utils/doDisplay';
import deleteCookies from './utils/deleteCookies';
import {
    clickElement, elementIsInPage, gotoPage, getSource, countElements, elementIsVisible, clearAllData, getText, elementIsNotInPage
} from './actions';
import pressKey from './actions/pressKey';
import fetch from './fetch';
import getDefaultOptions from './getDeafaultOptions';
import doPolyfill from './utils/polyfill';

let vendor;
    let apiHost;
    let actionApi;
    let testId;
let progressiveActionId = 0;
let nextAfterReload = undefined;
let pollingIteration = 0;
let lastStatus = 'waiting';
let bodyResponse = null;
let fps = 60;

const parseError = (error) => {
    try {
        return JSON.parse(error);
    } catch (e) {
        return (error); // error in the above string (in this case, yes)!
    }
};

const resetAutomation = () => {
    displayLog('##', 'cookies deleted');
    displayLog('!!', 'server is not updating action');
    lastStatus = 'ko';
    sendRequest();
}

const continuousTestPerformance = () => {
    try{
        const times = [];
        let average = 60;
        const startTestingPerformance = () => {
            window.requestAnimationFrame(() => {
                const now = performance.now();
                while (times.length > 0 && times[0] <= now - 1000) {
                    times.shift();
                }
                times.push(now);
                average = Math.floor((average + times.length) / 2);
                startTestingPerformance();
                fps = average;
                displayPerformance();
            });
        };
        startTestingPerformance();
    } catch (e) {
        document.getElementById('automation-console-performance').style.display = 'none';
    }
};

const displayPerformance = () => {
    try{
        const fpsForResp = fps === undefined ? '60' : fps.toString();
        bodyResponse = {
            ...bodyResponse,
            fps: fpsForResp
        }
        document.getElementById('automation-console-performance-fps-data')
            .innerText = fps || '..';
    } catch (e) {
        document.getElementById('automation-console-performance-fps-data')
            .innerText = '!!';
    }
};

const saveCookiesBeforeReload = (data) => {
    document.cookie = `app-automation-actionApi=${actionApi}`;
    document.cookie = `app-automation-next=${data.next}`;
    document.cookie = `app-automation-testId=${testId}`;
}

const doTestAction = (data) => {
    try {
        lastStatus = 'ok';
        displayPerformance();
        switch (data.action) {
            case 'clientSettings':
                displayLog('#', 'clientSettings');
                if (get(data, 'params.minimized') === true) {
                    toggleMainConsole(false);
                    toggleMinimizedConsole(true);
                }
                sendRequest();
                break;

            case 'goToPage':
                displayLog('{}', `url: ${get(data, 'params.url')}`);
                saveCookiesBeforeReload(data);
                gotoPage(data.params);
                sendRequest();
                break;

            case 'click':
                displayLog('{}', `click on: ${get(data, 'params.element')}`);
                lastStatus = clickElement(data.params);
                if (lastStatus === 'ko') displayLog('!!', 'element non clickable')
                sendRequest();
                break;

            case 'clearDataAndReload':
                if(parseInt(nextAfterReload) === data.next) {
                    resetAutomation();
                    break;
                }
                nextAfterReload = undefined;
                const automationEnabledCookie = getCookieByName(`app-automation-enabled`);
                clearAllData();
                document.cookie = `app-automation-enabled=${automationEnabledCookie}`;
                saveCookiesBeforeReload(data);
                displayLog('##', 'cookies deleted, reload in 2 seconds');
                displayLog('##', `next: ${data.next}`)
                setTimeout(()=>{
                    reloadPage()
                }, 5000);
                break;

            case 'reloadPage':
                reloadPage();
                break;

            case 'waitForElement':
                asyncWaitForElement(data);
                break;

            case 'waitForElementNotInPage':
                asyncWaitForElementNotInPage(data);
                break;

            case 'waitForElementIsVisible':
                asyncWaitForElement(data, true);
                break;

            case 'getSource':
                const sourceResp = getSource(data.params);
                bodyResponse = { response: sourceResp };
                sendRequest();
                break;

            case 'getText':
                const textResp = getText(data.params);
                bodyResponse = { response: textResp };
                sendRequest();
                break;

            case 'addCookie':
                const cookieToAddName = get(data, 'params.cookieName');
                const cookieToAddVale = get(data, 'params.cookieValue');
                document.cookie = `${cookieToAddName}=${cookieToAddVale}`;
                sendRequest();
                break;

            case 'deleteCookie':
                const cookieToDeleteName = get(data, 'params.cookieName');
                document.cookie = `${cookieToDeleteName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
                sendRequest();
                break;

            case 'getElementCount':
                const numOfElement = countElements(data.params);
                bodyResponse = { response: numOfElement.toString() };
                sendRequest();
                break;

            case 'sleep':
                const delay = get(data, 'params.time');
                displayLog('{}', `sleep for ${delay}s`);
                setTimeout(sendRequest, (delay * 1000));
                break;

            case 'connected':
                displayLog('{}', 'connected, no action');
                sendRequest();
                break;

            case 'keyDown':
                displayLog('{}', `key code: ${get(data.params, 'key')}`);
                pressKey(vendor, get(data.params, 'key'));
                sendRequest();
                break;

            case 'polling':
                if (pollingIteration === 60){
                    resetAutomation();
                    break;
                }
                pollingIteration ++;
                setTimeout(() => {
                    sendRequest();
                }, 100);
                break;

            case 'finish':
                displayLog('<>', 'Test completed')
                toggleMainConsole(true);
                toggleMinimizedConsole(false)
                reloadInInMinutes(3);
                break;

            default:
                displayLog('!!', 'ops..., not handled!');
                deleteCookies();
                break;
        }
    } catch (e) {
        displayLog('!!', `error doTestAction: ${parseError(e)}`);
        deleteCookies();
        lastStatus = 'ko';
        sendRequest();
        console.error(e);
    }
};

const reloadInInMinutes = (min) => {
    deleteCookies();
    const iterate = (progressive) => {
        displayLog('##', `Reload in ${progressive} min`);
        setTimeout(() => {
            if (progressive > 1) {
                iterate(progressive - 1);
            } else {
                displayLog('##', 'cookies deleted');
                reloadPage();
            }
        }, 60000);
    };
    iterate(min);
};

const reloadPage = () => {
    window.location.replace(`./index.html?refresh=${Date.now()}#/`);
}

const asyncWaitForElement = (data, isVisible) => {
    const doAsyncRequest = async () => {
        try {
            displayLog('{}', `search for: ${get(data, 'params.element')}`);
            lastStatus = isVisible === true ? await elementIsVisible(data.params) : await elementIsInPage(data.params);
            if (lastStatus === 'ko') {
                deleteCookies();
                displayLog('!!', 'elementNotFound')
            }
            sendRequest();
        } catch (e) {
            throw e;
        }
    };
    doAsyncRequest(data);
};

const asyncWaitForElementNotInPage = (data) => {
    const doAsyncRequest = async () => {
        try {
            displayLog('{}', `search for: ${get(data, 'params.element')}`);
            lastStatus = await elementIsNotInPage(data.params);
            if (lastStatus === 'ko') {
                deleteCookies();
                displayLog('!!', 'elementNotFound')
            }
            sendRequest();
        } catch (e) {
            throw e;
        }
    };
    doAsyncRequest(data);
};

const sendInstructionsRequest = async () => {
    displayLog('->', 'request to instruction');
    try {
        const url = `${apiHost}/instructions`;
        const headers = {
            vendor,
            'Content-Type': 'application/json',
        };
        const resp = await fetch(url, getDefaultOptions('GET', headers));
        const responseTextProcessed = await resp.text();
        const response = JSON.parse(responseTextProcessed);
        instructionResponseHandler(response);
    } catch (e) {
        displayLog('!!', `error on sendInstructionsRequest: ${parseError(e)}`);
    }
};

const sendRequest = async () => {
    displayLog('->', `status: ${lastStatus} | index: ${progressiveActionId}${bodyResponse === null ? '' : ' | data in body'}`);
    try {
        const url = `${apiHost}${actionApi}`;
        const headers = {
            vendor,
            'Content-Type': 'application/json',
            index: progressiveActionId,
            status: lastStatus,
        };
        const resp = await fetch(url, getDefaultOptions('PUT', headers, bodyResponse));
        const responseTextProcessed = await resp.text();
        const response = JSON.parse(responseTextProcessed);
        responseHandler(response);
    } catch (e) {
        displayLog('!!', `error on sendRequest: ${parseError(e)}`);
    }
};



const instructionResponseHandler = (data) => {
    try {
        displayLog('<-', `${data.action}`);
        if (data.path === undefined) {
            setTimeout(() => {
                sendInstructionsRequest();
            }, 5000);
        } else {
            displayId(data.path);
            displayLog('{}', 'handshake ok');
            testId = data.id;
            actionApi = data.path;
            sendRequest();
        }
    } catch (e) {
        displayLog('!!', `error instructionResponseHandler: ${parseError(e)}`);
    }
};

const responseHandler = (data) => {
    try {
        bodyResponse = null;
        if (data.action !== 'polling') {
            displayLog('##', `${progressiveActionId}`);
            displayLog('<-', `${data.action}`);
            progressiveActionId = data.next;
            pollingIteration = 0;
        } else {
            displayLog('<-', 'polling');
        }
        setTimeout(() => {
            doTestAction(data);
        }, 100);
    } catch (e) {
        displayLog('!!', `error on responseHandler: ${parseError(e)}`);
    }
};


const doOnLoad = () => {
    try {
        const cookieActionApi = getCookieByName(`app-automation-actionApi`)
        if (!isEmpty(cookieActionApi)) {
            actionApi = getCookieByName(`app-automation-actionApi`);
            nextAfterReload = progressiveActionId = getCookieByName(`app-automation-next`);
            const toggleConsoleApi = getCookieByName(`app-automation-minimizedConsoleDisplay`)
            if (!isEmpty(toggleConsoleApi)) {
                toggleMinimizedConsole(true)
                toggleMainConsole(false)
            }
            testId = getCookieByName(`app-automation-testId`);
            displayLog('##', 'data in cookies!');
            displayLog('##', `actionApi: ${actionApi}`);
            displayId(`reload: ${actionApi}`);
            deleteCookies();
            lastStatus = 'ok';
            sendRequest();
        } else {
            displayLog('{}', 'start testing');
            setTimeout(() => {
                sendInstructionsRequest();
            }, 5000);
        }
    } catch (e) {
        displayLog('!!', `error on doOnLoad: ${parseError(e)}`);
    }
};

const automation = () => {
    try {
        doPolyfill();
        const pJson = require('../package.json');
        createConsole();
        continuousTestPerformance();
        displayLog('##', `lib version: ${pJson.version}`);
        const script_tag = document.getElementById('automationScriptTest');
        const API_HOST = script_tag.getAttribute("api_host");
        apiHost = `${API_HOST}`;
        displayLog('##', `apiHost: ${apiHost}`);
        vendor = script_tag.getAttribute("vendor");
        displayId(`vendor: ${vendor}`);
        doOnLoad();
    } catch (e) {
        console.error(e);
        displayLog('!!', `error on actionsOnStart: ${parseError(e)}`);
    }
};

export default automation;
