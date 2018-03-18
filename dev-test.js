
const notoTime = require('./');

const noto = notoTime({connectionUri: process.env.DB_CONNECTION_URI}, 'noto-test', {});

let timer = noto.start('normal-timer');

// This should save about 500 ms
setTimeout(() => {
    timer.end();
}, 500);

// This should save about 1000 ms, but total execution time should be about 1500 ms
let timerWithPause = noto.start('with-pause');
setTimeout(() => {
    timerWithPause.pause();
    setTimeout(() => {
        timerWithPause.continue();
        setTimeout(() => {
            timerWithPause.end();
        }, 500);
    }, 500);
}, 500);
