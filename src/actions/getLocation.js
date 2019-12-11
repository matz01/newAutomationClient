const getLocation = () => {
    try {
        const path = window.location.href;
        return path;
    } catch (e) {
        throw e;
    }
};

export default getLocation;
