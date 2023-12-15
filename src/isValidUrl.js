function isValidHttpUrl(string) {
    let url;

    string = makeValidUrl(string)

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return true;
}

function isHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function makeValidUrl(string) {
    string = string.trim();

    if (!string.startsWith('http://') && !string.startsWith('https://')) {
        string = 'https://' + string;
    }

    return string;
}

module.exports = {
    isValidHttpUrl,
    makeValidUrl,
    isHttpUrl
};

