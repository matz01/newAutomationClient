const clearAllData = () => {
    try {
        document.cookie.split(";")
            .forEach(function(c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        window.localStorage.clear();
    } catch (e) {
        throw e
    }
}
export default clearAllData;
