export default function getCookieByName(name) {
    try {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    } catch (e) {
        throw(e);
    }
}
