import { setConsoleColor, toggleMainConsole, toggleMinimizedConsole } from './createConsole';

let error = false;

export const displayId = (api) => {
    document.getElementById('idConsole').innerText = `${api}`;
};

export const displayLog = (type, msg) => {
    if (type === '++'){
        toggleMainConsole(true);
        toggleMinimizedConsole(false)
        setConsoleColor('red');
        error = true;
    }

    if (type === '<>' && !error){
        setConsoleColor('green');
    }

    if (document.getElementById('logConsole__inner').childElementCount >= 12) {
        const child = document.getElementById('logConsole__inner').firstElementChild;
        document.getElementById('logConsole__inner')
            .removeChild(child);
    }
    const node = document.createElement('div');
    node.textContent = `${type} ${msg}`;
    document.getElementById('logConsole__inner')
        .appendChild(node);

    document.getElementById('minimizedConsole')
        .innerText = type;

};
