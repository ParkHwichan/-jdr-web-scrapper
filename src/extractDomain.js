const extractDomain = (url) => {

    let domain = url.split('/')[2];

    return domain;
}


module.exports = extractDomain;