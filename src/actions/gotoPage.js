const gotoPage = (data) => {
    try {
        window.location.href = data.url
        return 'ok';
    } catch (e) {
        return 'ko'
    }
}

export default gotoPage;
