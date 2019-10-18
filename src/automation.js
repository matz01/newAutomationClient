import 'unfetch/polyfill'
import createConsole from './utils/createConsole';
import getCookieByName from './utils/getCookieByName';
import {
    displayerror,
    displayInApiConsole,
    displayrecived,
    displayInIdConsole,
    displayStatus,
    displayInConsole
} from './utils/doDisplay';
import deleteCookies from './utils/deleteCookies';
import { clickElement, elementIsInPage, gotoPage } from './actions';
import pressKey from './actions/pressKey';
import get from 'lodash/get';


let vendor, api_host, actionApi, testId;
let progressiveActionId = 0;
let lastStatus = 'waiting';
let lastBody = {};


const serverLog = (msg) => {
    console.log(msg)
    return;
    try{
        fetch(`/log?status=${msg}`)
            .then( data => console.log(data) )
    } catch (e) {
        console.error(e)
        throw(e)
    }
}


const doTestAction = async (data) => {
    serverLog('doTestAction')
    try {
        lastStatus = "ok";
        lastBody = {};
        displayStatus('...')
        displayrecived(data.action)
        switch (data.action) {
            case 'goToPage':
                document.cookie = `app-automation-actionApi=${actionApi}`;
                document.cookie = `app-automation-next=${data.next}`;
                document.cookie = `app-automation-testId=${testId}`
                displayInConsole('goToPage');
                gotoPage(data.params);
                displayStatus('ok')
                sendRequest();
                break;

            case 'click':
                displayInConsole('clickElement');
                clickElement(data.params);
                displayStatus('ok')
                sendRequest();
                break;

            case 'waitForElement':
                displayInConsole('elementIsInPage');
                lastStatus = await elementIsInPage(data.params);
                if(lastStatus === 'ko') deleteCookies()
                lastBody = lastStatus === 'ko' ? {msg: 'element not found'} : lastBody;
                displayStatus(lastStatus)
                sendRequest();
                break;

            case 'connected':
                displayInConsole('connected, no action');
                displayStatus('ok')
                sendRequest();
                break;

            case 'keyDown':
                displayInConsole('pressKey');
                pressKey(vendor, get(data.params, 'key'));
                displayStatus('ok')
                sendRequest();
                break;

            case "polling":
                setTimeout(() => {
                    sendRequest();
                }, 1000);
                break;

            case "finish":
                deleteCookies();
                displayInConsole('test finish. Reload in 5min');
                displayStatus('ok');
                setTimeout(()=>{
                    gotoPage({url: '/'});
                }, 300000)
                break;

            default:
                displayInConsole(`ops..., not handled!`);
                displayStatus("ko");
                deleteCookies()
                break;
        }
    } catch (e) {
        serverLog(`error doTestAction: ${e}`)
        deleteCookies();
        lastStatus = "ko";
        displayStatus("ko")
        lastBody = {msg: e}
        displayerror(e);
        sendRequest();
        console.error(e)
    }
};

const sendInstructionsRequest = () => {
    try{
        serverLog('sendInstructionsRequest')
        fetch(`${api_host}/instructions`, {
            method: 'GET',
            headers: {
                'vendor': vendor,
                'Content-Type': 'application/json'
            }
        })
            .then( checkStatus )
            .then(r => r.json())
            .then( instructionResponseHandler );
    } catch (e) {
        serverLog(`error on sendInstructionsRequest: ${e}`)
    }
}

const sendRequest = () => {
    try {
        fetch(`${api_host}${actionApi}`, {
            mode: 'no-cors',
            method: 'GET',
            headers: {
                'vendor': vendor,
                index: progressiveActionId,
                status: lastStatus,
                msg: lastBody
            }
        })
            .then(checkStatus)
            .then(r => r.json())
            .then(responseHandler);
    } catch (e) {
        serverLog(`error on sendRequest: ${e}`)
    }
};

function checkStatus(response) {
    serverLog(`checkStatus ${response.status}`)
    try{
        if (response.status === 200) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            displayerror(error);
            serverLog(`error on checkStatus resp: ${error}`)
            return Promise.reject(error);
        }
    } catch (e) {
        serverLog(`error on checkStatus: ${e}`)
    }

}

const instructionResponseHandler = (data) => {
    try {

        serverLog('instructionResponseHandlerz')
        if (data.path === undefined) {
            displayInConsole(progressiveActionId, 'polling for setup...');
            setTimeout(() => {
                displayInConsole(progressiveActionId,'...');
                sendInstructionsRequest();
            }, 5000);
        } else {
            displayInApiConsole(data.path);
            displayInConsole(progressiveActionId,'handshake ok');
            testId = data.id;
            displayInIdConsole(vendor, data.id)
            actionApi = data.path
            sendRequest()
        }
    } catch (e) {
        serverLog(`error instructionResponseHandler: ${e}`)
        displayerror(e);
    }
};

const logResp = (data) => {
    try{
        serverLog(`logResp ${data}`)
        return data
    } catch (e) {
        serverLog(`error logResp: ${e}`)
    }
}


const responseHandler = (data) => {
    serverLog('responseHandler');
    try {
        serverLog(`data.action: ${data.action}`);
        if(data.action !== 'polling') progressiveActionId = data.next;
        setTimeout(() => {
            doTestAction(data);
        }, 200);
    } catch (e) {
        displayerror(e);
        serverLog(`error on responseHandler: ${e}`);
    }
};


const doOnLoad = () => {
    try {
        createConsole();

        if(getCookieByName('app-automation-actionApi') !== undefined) {
            actionApi = getCookieByName('app-automation-actionApi')
            progressiveActionId = getCookieByName('app-automation-next');
            testId = getCookieByName('app-automation-testId');
            displayInApiConsole(actionApi);
            displayInIdConsole(vendor, testId)
            displayInConsole(progressiveActionId, 'continue testing');
            deleteCookies();
            lastStatus = 'ok';
            lastBody = {};
            sendRequest()
        } else {
            displayInApiConsole('/instructions');
            displayInIdConsole(vendor, '...')
            displayInConsole(progressiveActionId, 'start testing');
            setTimeout(() => {
                sendInstructionsRequest();
            }, 5000);
        }

    } catch (e) {
        serverLog(`error on doOnLoad: ${e}`)
    }
};

const actionsOnStart = () => {
    try{
        const script_tag = document.getElementById('automationScriptTest');
        api_host = script_tag.getAttribute("api_host");
        vendor = script_tag.getAttribute("vendor");
        doOnLoad();
    } catch (e) {
        serverLog(`error on actionsOnStart: ${e}`)
    }
}

const automation = () => {
    serverLog('Start')
    if( document.readyState !== 'loading' ) {
        serverLog( 'AUTOMATION - document is already ready, just execute code here' );
        actionsOnStart();
    } else {
        serverLog("AUTOMATION - 2")
        document.addEventListener('DOMContentLoaded', function () {
            serverLog('Loaded')
            actionsOnStart();
        });
    }
};


export default automation;
