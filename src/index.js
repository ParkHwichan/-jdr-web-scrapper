
const {isValidHttpUrl, makeValidUrl, isHttpUrl} = require("./isValidUrl");
const puppeteer = require('puppeteer');
const isImageUrl = require('./isImageUrl')
const extractDomain = require("./extractDomain");

const load = async (url) => {

    if (isValidHttpUrl(url) === false) {
        throw new Error('Please provide a valid url')
    }

    url = makeValidUrl(url)

    const result = getInfo(url);

    return result;
}

const getInfo = async (url) => {
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_BIN || null,
        headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox',],
    });

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'}); // 네트워크 활동이 멈출 때까지 기다립니다.


    const domain = extractDomain(url);
    console.log("Domain: " + domain);
    const result = await page.evaluate(() => {

            const title = document.title;
            const bodyElements = document.querySelectorAll('body *');
            const body = Array.from(bodyElements).map(element => {
                if(typeof element.innerText !== 'string') {
                    return '';
                }
                return element.innerText.trim();
            }).filter(element => {
                const realLength = element.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, "$&$1$2").length;

                return realLength > 0;
            });


            const head = document.head.innerHTML;
            const metaElements = document.querySelectorAll('meta');
            const meta = Array.from(metaElements).map(element => {
                const obj = {};
                Array.from(element.attributes).forEach(attribute => {
                    obj[attribute.name] = attribute.value;
                });
                return obj;
            });
            const allElements = document.querySelectorAll('*');
            const all = Array.from(allElements).map(element => {
                const obj = {};
                Array.from(element.attributes).forEach(attribute => {
                    obj[attribute.name] = attribute.value;
                });
                return obj;
            });


            return {
                title,
                body,
                head,
                meta,
                all,
            }
        }
    );


    const images = filterImage(result.all, domain);
    await browser.close();

    removeHref(result.meta);
    removeHref(result.all);

    return {
        title: result.title,
        body: result.body,
        images : JSON.stringify(images),
        meta: result.meta,
        all: result.all,
    }
}


const filterImage = (elements, domain) => {

    const filtered = [];

    elements.forEach(element => {
            for (let key in element) {


                let cloneElement = {...element};

                let convertedUrl = cloneElement[key];
                if(typeof convertedUrl !== 'string') {
                    continue;
                }

                if(convertedUrl.startsWith('//')) {
                    convertedUrl= 'https:' + convertedUrl;
                }

                if(convertedUrl.startsWith('/')) {
                    convertedUrl= 'https://' + domain + convertedUrl;
                }

                if (!isHttpUrl(convertedUrl)) {
                    continue;
                }

                if (isImageUrl(convertedUrl)) {
                    cloneElement[key] = convertedUrl;
                    filtered.push(cloneElement);
                }
            }
        }
    )

    return filtered;
}


const removeHref = (elements) => {
    elements.forEach(element => {
            for (let key in element) {
                if (key === 'href') {
                    delete element[key];
                }
            }
        }
    )
}


module.exports = {
    load,
    getInfo
}