const deleteCookies = () => {
    document.cookie = 'app-automation-actionApi= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'app-automation-next= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'app-automation-testId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'app-automation-minimizedConsoleDisplay= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
};

export default deleteCookies;
