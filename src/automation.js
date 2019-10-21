import 'unfetch/polyfill'
import createConsole from './utils/createConsole';
import getCookieByName from './utils/getCookieByName';
import {
    displayId,
    displayLog
} from './utils/doDisplay';
import deleteCookies from './utils/deleteCookies';
import { clickElement, elementIsInPage, gotoPage } from './actions';
import pressKey from './actions/pressKey';
import get from 'lodash/get';


let vendor, api_host, actionApi, testId;
let progressiveActionId = 0;
let lastProgressiveActionId = -1;
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
        switch (data.action) {
            case 'goToPage':
                displayLog(`url: ${get(data, 'params.url')}`);
                document.cookie = `app-automation-actionApi=${actionApi}`;
                document.cookie = `app-automation-next=${data.next}`;
                document.cookie = `app-automation-testId=${testId}`
                gotoPage(data.params);
                sendRequest();
                break;

            case 'click':
                displayLog(`click on: ${get(data, 'params.element')}`);
                clickElement(data.params);
                sendRequest();
                break;

            case 'waitForElement':
                displayLog(`search for: ${get(data, 'params.element')}`);
                lastStatus = await elementIsInPage(data.params);
                if(lastStatus === 'ko') deleteCookies()
                lastBody = lastStatus === 'ko' ? {msg: 'element not found'} : lastBody;
                sendRequest();
                break;

            case 'connected':
                displayLog('connected, no action');
                sendRequest();
                break;

            case 'keyDown':
                displayLog(`key code: ${get(data.params, 'key')}`);
                pressKey(vendor, get(data.params, 'key'));
                sendRequest();
                break;

            case "polling":
                setTimeout(() => {
                    sendRequest();
                }, 1000);
                break;

            case "finish":
                deleteCookies();
                displayLog('test finish. Reload in 5min');
                setTimeout(()=>{
                    gotoPage({url: '/'});
                }, 300000)
                break;

            default:
                displayLog(`ops..., not handled!`);
                deleteCookies()
                break;
        }
    } catch (e) {
        displayLog(`error doTestAction: ${e}`)
        deleteCookies();
        lastStatus = "ko";
        lastBody = {msg: e}
        sendRequest();
        console.error(e)
    }
};

const sendInstructionsRequest = () => {
    displayLog('<- request to instruction');
    try{
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
    displayLog(`<- ${lastStatus}`);
    try {
        fetch(`${api_host}${actionApi}`, {
            method: 'GET',
            headers: {
                'vendor': vendor,
                'Content-Type': 'application/json',
                index: progressiveActionId,
                status: lastStatus
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
            displayLog(`error on checkStatus resp: ${error}`)
            return Promise.reject(error);
        }
    } catch (e) {
        serverLog(`error on checkStatus: ${e}`)
    }

}

const instructionResponseHandler = (data) => {
    try {
        displayLog(`-> ${data.action}`)
        if (data.path === undefined) {
            setTimeout(() => {
                sendInstructionsRequest();
            }, 5000);
        } else {
            displayId(data.path);
            displayLog('handshake ok');
            testId = data.id;
            actionApi = data.path
            sendRequest()
        }
    } catch (e) {
        displayLog(`error instructionResponseHandler: ${e}`)
    }
};

const responseHandler = (data) => {
    serverLog('responseHandler');
    try {
        serverLog(`data.action: ${data.action}`);
        if(data.action !== 'polling') {
            displayLog(`${progressiveActionId} | -> ${data.action}`);
            progressiveActionId = data.next
        } else {
            if (lastProgressiveActionId !== progressiveActionId){
                displayLog(`-> polling`);
                progressiveActionId = lastProgressiveActionId;
            }
        }
        setTimeout(() => {
            doTestAction(data);
        }, 200);
    } catch (e) {
        displayLog(`error on responseHandler: ${e}`);
    }
};


const doOnLoad = () => {
    try {
        if(getCookieByName('app-automation-actionApi') !== undefined) {
            actionApi = getCookieByName('app-automation-actionApi')
            progressiveActionId = getCookieByName('app-automation-next');
            testId = getCookieByName('app-automation-testId');
            displayLog(`actionApi: ${actionApi}`);
            displayId(`reload: ${actionApi}`);
            deleteCookies();
            lastStatus = 'ok';
            lastBody = {};
            sendRequest()
        } else {
            displayLog('/instructions');
            displayLog( 'start testing');
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
        createConsole();
        const script_tag = document.getElementById('automationScriptTest');
        api_host = script_tag.getAttribute("api_host");
        vendor = script_tag.getAttribute("vendor");
        doOnLoad();
    } catch (e) {
        serverLog(`error on actionsOnStart: ${e}`)
    }
}

const automation = () => {
    console.log('Start')
    if( document.readyState !== 'loading' ) {
        console.log( 'AUTOMATION - document is already ready, just execute code here' );
        actionsOnStart();
    } else {
        console.log("AUTOMATION - 2")
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Loaded')
            actionsOnStart();
        });
    }
};


export default automation;
