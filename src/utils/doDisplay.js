export const displayInIdConsole = (vendor, msg) => {
    document.getElementById('idConsole').innerText = `${vendor} / ${msg}`;
};

export const displayStatus = (msg) => {
    document.getElementById('statusConsole').innerText = `${msg}`;
};


export const displayrecived = (msg) => {
    document.getElementById('commandConsole').innerText = `api: ${msg}`;
};

export const displayInApiConsole = (msg) => {
    document.getElementById('apiConsole').innerText = msg;
};

export const displayerror = (msg) => {
    document.getElementById('errorConsole').style.visibility = 'visible';
    const node = document.createElement('p');
    node.textContent = msg;
    document.getElementById('errorConsole').appendChild(node);
};

export const displayInConsole = (progressiveActionId, msg) => {
    document.getElementById('smarttestconsole').innerText = `${msg}`;
    document.getElementById('progConsole').innerText = progressiveActionId || '0';
};
