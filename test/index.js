const args = process.argv.slice(2);
const {isValidHttpUrl} = require("../src/isValidUrl");
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const {load} = require("../src");

// createInterface() 메소드를 이용해 객체를 만들고, rl이라는 변수에 저장
const rl = readline.createInterface({ input, output });

rl.question('Please provide a url to scrap: ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`start to scrap ${answer}`);
    rl.close();

    if (!answer) {
        console.log('Please provide a url to scrap');
        process.exit(1);
    }

    if (!isValidHttpUrl(answer)) {
        console.log('Please provide a valid url');
        process.exit(1);
    }

    const {load} = require('../src');

    (async () => {
        const result = await load(answer);
        console.log(result.images);
    })();



});


