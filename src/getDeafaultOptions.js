const getDefaultOptions = (method, headers, body, timeout) => {
    return {
        method,
        headers,
        body: JSON.stringify(body),
        timeout: timeout || 25000,
    };
};

export default getDefaultOptions;
