export const displayId= (api) => {
    document.getElementById('idConsole').innerText = `${api}`;
};



export const displayLog = (msg) => {
    //document.getElementById('logConsole').textContent += `\n${msg}`;


    if(document.getElementById('logConsole__inner').childElementCount >= 12) {
        const child = document.getElementById('logConsole__inner').firstElementChild;
        document.getElementById('logConsole__inner').removeChild(child);
    }



    const node = document.createElement('div');
    node.textContent = `${msg}`;
    document.getElementById('logConsole__inner').appendChild(node);
};
