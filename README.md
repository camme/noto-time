# Super simple time logging module to save measured times to a database

```noto-time``` will save each entry with how much time it took to execute, an id, a service id and whatever meta data you need.
It also gives you the ability to pause a timer, in case you want to measure something that shouldnt include a sub task.

```noto-time``` will bulk save entries to the database at a given interval to save performance.

This module was created 2018-03-15 so its very very alpha.

## How to use:

    const notoTime = require('noto-time');

    // Pass a connection uri in this format: postgres://foo:foobarbaz@db/noto. More info on this further down.
    const noto = notoTime({connectionUri: process.env.DB_CONNECTION_URI}, service: 'noto-test', meta: {});

    // This is a normal timer with an identifier
    let timer = noto.start('normal-timer');

    // This should save about 500 ms
    setTimeout(() => {

        // End the timer like this
        timer.end();

    }, 500);

## With pause

    const notoTime = require('noto-time');

    // Pass a connection uri in this format: postgres://foo:foobarbaz@db/noto. More info on this further down.
    const noto = notoTime({connectionUri: process.env.DB_CONNECTION_URI}, service: 'noto-test', meta: {});

    // This should save about 1000 ms, but total execution time should be about 1500 ms,
    // bacause it pauses the timer

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

## Options

```noto-time``` can be initialized with some options:

    const noto = notoTime(options);
  
where ```options``` is an object with the following keys:

    {
        connectionUri: [connection uri],
        service: [string], // defaults to 'noto-test'
        meta: [object], // defaults to [],
        saveTimeout: [integer], // how often it should save to the database in ms. Defaults to 5000,
        enabled: true, // This can be set to false and noto-time will not log anything. It exists so you can have measurements
                       // that might be turned off in production

    }



