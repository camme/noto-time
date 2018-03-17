const db = require('./db');

const defaultOptions = {
    saveTimeout: 5000,
};

const Noto = async (options) => {

    let instanceOptions = Object.assign(defaultOptions, options);
    let { connectionUri, serviceId, meta, saveTimeout} = instanceOptions;

    this.db = await db.init(connectionUri);

    let columns = {
        identifier: { type: db.Sequelize.STRING},
        service: { type: db.Sequelize.STRING },
        meta: { type: db.Sequelize.JSON },
        time: { type: db.Sequelize.INTEGER },
    };

    let table = this.db.sequelize.define('noto', columns);

    let logList = [];

    const log = (identifier, elapsedTime) => {
        logList.push({serviceId, meta, identifier, elapsedTime});
    };

    const save = async () => {
        await table.bulkCreate(logList);
        logList = [];
        setTimeout(save, saveTimeout);
    };
    setTimeout(save, saveTimeout);

    this.start = (identifier) => {

        let time = (new Date()).getTime();
        let pauses = [];
        let state = 'running';
        let pauseStarted = null;

        return {

            pause: () => {
                pauseStarted = (new Date()).getTime();
                state = 'paused';
            },

            continue: () => {
                let delta = (new Date()).getTime() - pauseStarted;
                pauses.push(delta);
                state = 'running';
            },

            end: () => {
                let elapsedTime = (new Date()).getTime() - time - pauses.reduce((total, pause) => total + pause, 0);
                state = 'ended';

                log(identifier, elapsedTime);

            },

            status: () => {
                return state;
            },

        };

    };

    return this;

};

module.exports = Noto;


