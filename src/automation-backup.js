import get from 'lodash/get';
import { clickElement, elementIsInPage, gotoPage } from './actions';
import pressKey from './actions/pressKey';
import getCookieByName from './utils/getCookieByName';
import createConsole from './utils/createConsole';

let vendor, api_host, actionApi, testId;
let progressiveActionId = 0;
let lastStatus = 'waiting';
let lastBody = {};

const sendInstructionsRequest = () => {
    fetch(`${api_host}/instructions`, {
        mode: 'no-cors',
        method: 'GET',
        headers: {
            'vendor': vendor,
        }
    })
        .then( checkStatus )
        .then(r => r.json())
        .then( instructionResponseHandler );
}

const sendRequest = () => {
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
        .then( checkStatus )
        .then(r => r.json())
        .then( responseHandler );
};


function checkStatus(response) {
    if (response.status === 200) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        displayerror(error);
        return Promise.reject(error);
    }
}

const doTestAction = async (data) => {
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
        deleteCookies();
        lastStatus = "ko";
        displayStatus("ko")
        lastBody = {msg: e}
        displayerror(e);
        sendRequest();
        console.error(e)
    }
};

const deleteCookies = () => {
    document.cookie = "app-automation-actionApi=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "app-automation-next=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "app-automation-testId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


const instructionResponseHandler = (data) => {
    try {
        if (data.path === undefined) {
            displayInConsole('polling for setup...');
            setTimeout(() => {
                displayInConsole('...');
                sendInstructionsRequest();
            }, 5000);
        } else {
            displayInApiConsole(data.path);
            displayInConsole('handshake ok');
            testId = data.id;
            displayInIdConsole(data.id)
            actionApi = data.path
            sendRequest()
        }
    } catch (e) {
        displayerror(e);
    }
};

const responseHandler = (data) => {
    try {
        if(data.action !== 'polling') progressiveActionId = data.next;
        setTimeout(() => {
            doTestAction(data);
        }, 200);
    } catch (e) {
        displayerror(e);
    }
};

const displayInConsole = (msg) => {
    document.getElementById('smarttestconsole').innerText = `${msg}`;
    document.getElementById('progConsole').innerText = progressiveActionId || '0';
};

const displayInIdConsole = (msg) => {
    document.getElementById('idConsole').innerText = `${vendor} / ${msg}`;
};

const displayStatus = (msg) => {
    document.getElementById('statusConsole').innerText = `${msg}`;
};


const displayrecived = (msg) => {
    document.getElementById('commandConsole').innerText = `api: ${msg}`;
};

const displayInApiConsole = (msg) => {
    document.getElementById('apiConsole').innerText = msg;
};

const displayerror = (msg) => {
    document.getElementById('errorConsole').style.visibility = 'visible';
    const node = document.createElement('p');
    node.textContent = msg;
    document.getElementById('errorConsole').appendChild(node);
};

const doOnLoad = () => {
    try {
        createConsole();
        if(getCookieByName('app-automation-actionApi') !== undefined) {
            actionApi = getCookieByName('app-automation-actionApi')
            progressiveActionId = getCookieByName('app-automation-next');
            testId = getCookieByName('app-automation-testId');
            displayInApiConsole(actionApi);
            displayInIdConsole(testId)
            displayInConsole('continue testing');

            deleteCookies()
            lastStatus = 'ok';
            lastBody = {};
            sendRequest()
        } else {
            displayInApiConsole('/instructions');
            displayInIdConsole('...')
            displayInConsole('start testing');
            setTimeout(() => {
                sendInstructionsRequest();
            }, 5000);
        }

    } catch (e) {
        console.error('doOnLoad:', e)
        displayerror(e);
        throw e;
    }
};

const actionsOnStart = () => {
    try{
        const script_tag = document.getElementById('automationScriptTest');
        api_host = script_tag.getAttribute("api_host");
        vendor = script_tag.getAttribute("vendor");
        doOnLoad();
    } catch (e) {
        console.error("actionsOnStart:", e)
    }
}

const automation = () => {
    console.log("AUTOMATION - 1")
    if( document.readyState !== 'loading' ) {
        console.log( 'AUTOMATION - document is already ready, just execute code here' );
        actionsOnStart()
    } else {
        console.log("AUTOMATION - 2")
        document.addEventListener('DOMContentLoaded', function () {
            actionsOnStart();
        });
    }
};

automation();
//export default automation;
