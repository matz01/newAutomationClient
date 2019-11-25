const deleteCookies = () => {
    const pJson = require('../../package.json')
    document.cookie = `app-automation-actionApi-${pJson.version}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `app-automation-next-${pJson.version}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `app-automation-testId-${pJson.version}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `app-automation-minimizedConsoleDisplay-${pJson.version}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};

export default deleteCookies;
