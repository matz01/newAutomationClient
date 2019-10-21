const baseBorderMargin = .8;
const baseMargin = .3;
const baseHeight = 2.2;
const boxWidth = 30
const fontSize = .9;
const baseStyle = `font-family: "Courier New", Courier, monospace; font-size:${fontSize}em; position: absolute; box-sizing: border-box; padding: .4em .3em; z-index: 999999999; border-radius: .2em; min-height:${baseHeight}em; overflow: hidden; text-overflow: ellipsis;`;

const createElement = (id, customStyle, bottomPosition) => {
    const node = document.createElement('div');
    node.setAttribute('id', id);
    const bottom = bottomPosition * (baseHeight + baseMargin) + baseBorderMargin;
    node.style.cssText = `${baseStyle} ${customStyle} bottom: ${bottom}em`;
    document.body.appendChild(node);
};

const createLogConsole = () => {
    createElement(
        'logConsole',
        `width: ${boxWidth}em; color: #fff; height: 16em; background-color: #b300b3; right: ${baseBorderMargin}em;`,
        1
    );

    const node = document.createElement('div');
    node.setAttribute('id', 'logConsole__inner');
    node.style.cssText = `bottom: 0; position: absolute; width: 100%;`;
    document.getElementById('logConsole').appendChild(node);
};

const idConsole = () => {
    createElement(
        'idConsole',
        `width: ${boxWidth}em; color: #fff; font-weight: bold; background-color: #454d66; right: ${baseBorderMargin}em;`,
        0
    );
};


const createConsole = () => {
    createLogConsole();
    idConsole();
};

export default createConsole;
