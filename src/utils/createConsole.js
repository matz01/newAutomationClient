const baseBorderMargin = .8;
const baseMargin = .3;
const baseHeight = 3.2;
const idBaseHeight = 1.8;
const boxWidth = 30;
const fontSize = .9;
const colors = {
    green: '#689f38',
    purple: '#454d66',
    red: '#800020',
    blue: '#014666'
}
const baseStyle = `font-family: "Courier New", Courier, monospace; font-size:${fontSize}em; position: absolute; box-sizing: border-box; padding: .4em .3em; z-index: 999999999; border-radius: .2em; min-height:${idBaseHeight}em; overflow: hidden; text-overflow: ellipsis;`;

const createElement = (id, customStyle, bottomPosition) => {
    const node = document.createElement('div');
    node.setAttribute('id', id);
    const bottom = bottomPosition * (idBaseHeight + baseMargin) + baseBorderMargin;
    node.style.cssText = `${baseStyle} ${customStyle} bottom: ${bottom}em`;
    document.body.appendChild(node);
};

const createLogConsole = () => {
    createElement(
        'logConsole',
        `width: ${boxWidth}em; color: #fff; height: 16em; background-color: ${colors.blue}; right: ${baseBorderMargin}em;`,
        1
    );

    const node = document.createElement('div');
    node.setAttribute('id', 'logConsole__inner');
    node.style.cssText = `bottom: 0; position: absolute; width: 100%; word-wrap: break-word; overflow: hidden; width:${boxWidth - 0.4}em`;
    document.getElementById('logConsole').appendChild(node);
};

const createIdConsole = () => {
    createElement(
        'idConsole',
        `width: ${boxWidth}em; color: #fff; font-weight: bold; background-color: #454d66; right: ${baseBorderMargin}em;`,
        0
    );
};

const createMinimizedConsole = () => {
    createElement(
        'minimizedConsole',
        `width: 2em; color: #fff; font-weight: bold; background-color: #689f38; right: ${baseBorderMargin}em;`,
        0
    );
}

const toggleMainConsole = (show) => {
    document.getElementById('idConsole').style.display = show ? 'block' : 'none';
    document.getElementById('logConsole').style.display = show ? 'block' : 'none';
}

const toggleMinimizedConsole = (show) => {
    document.getElementById('minimizedConsole').style.display = show ? 'block' : 'none';
    if(show === true){
        document.cookie = `app-automation-minimizedConsoleDisplay=${show}`;
    } else {
        document.cookie = 'app-automation-minimizedConsoleDisplay= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    }
};

const setConsoleColor = (color) => {
    document.getElementById('logConsole').style.backgroundColor = colors[color];
}

const createConsole = () => {
    createLogConsole();
    createIdConsole();
    createMinimizedConsole();
    toggleMinimizedConsole(false);
};

export { createMinimizedConsole, toggleMinimizedConsole, toggleMainConsole, setConsoleColor };

export default createConsole;
