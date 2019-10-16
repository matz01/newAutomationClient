const baseBorderMargin = .8;
const baseMargin = .3;
const littleBoxWidth = 4;
const baseHeight = 1.8;
const bigBoxWidth = 15;
const fullBoxWidth = littleBoxWidth + baseMargin + bigBoxWidth;
const fontSize = 1;
const baseStyle = `font-size:${fontSize}em; position: absolute; padding: .4em .3em; z-index: 999999999; border-radius: .2em; height:${baseHeight}em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

const createElement = (id, customStyle, bottomPosition) => {
    const node = document.createElement('div');
    node.setAttribute('id', id);
    const bottom = bottomPosition * (baseHeight + baseMargin) + baseBorderMargin;
    node.style.cssText = `${baseStyle} ${customStyle} bottom: ${bottom}em`
    node.textContent = '...';
    document.body.appendChild(node);
}

const createApiConsole = () => {
    createElement(
        'apiConsole',
        `font-weight: bold; text-align: right; color: #111; width: ${fullBoxWidth}em; background-color: #ff4d4d; right: ${baseBorderMargin}em;`,
        0
    )
}

const createActionConsole = () => {
    createElement(
        'smarttestconsole',
    `width: ${bigBoxWidth}em; color: #fff; background-color: #b33693; right: ${baseBorderMargin + baseMargin + littleBoxWidth}em;`,
        1
    )
};

const createStatusConsole = () => {
    createElement(
        'statusConsole',
        `text-align: right; width: ${littleBoxWidth}em; color: #fff; background-color: #b300b3; right: ${baseBorderMargin}em;`,
        1
    )
}

const createIndexConsole = () => {
    createElement(
        'progConsole',
        `width: ${littleBoxWidth}em; color: #333; background-color: #eacf02; right: ${baseBorderMargin + baseMargin + bigBoxWidth}em;`,
        2
    )

}


const commandConsole = () => {
    createElement(
        'commandConsole',
        `width: ${bigBoxWidth}em; color: #fff; background-color: #58b368; right: ${baseBorderMargin}em;`,
        2
    )

}

const idConsole = () => {
    createElement(
        'idConsole',
        `width: ${bigBoxWidth}em; color: #fff; font-weight: bold; background-color: #454d66; right: ${fullBoxWidth + baseBorderMargin + baseMargin}em;`,
        0
    )
}

const errorConsole = () => {
    const node = document.createElement('div');
    node.setAttribute('id', 'errorConsole');
    const bottom = 3 * (baseHeight + baseMargin) + baseBorderMargin;
    node.style.cssText = `visibility: hidden; color: #fff; font-size:${fontSize}em; width: ${fullBoxWidth}em; bottom: ${bottom}em; right: ${baseBorderMargin}em; background-color:#ff0000; position: absolute; padding: .4em .3em; z-index: 999999999; border-radius: .2em; `;
    document.body.appendChild(node);
}




const createConsole = () => {
    createApiConsole();
    createActionConsole();
    createStatusConsole();
    createIndexConsole();
    commandConsole();
    idConsole();
    errorConsole();
}

export default createConsole;
