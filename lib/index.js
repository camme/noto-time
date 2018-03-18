const db = require('./db');

const defaultOptions = {
    saveTimeout: 5000,
    service: 'noto-service',
    meta: {},
};

const Noto = (options) => {

    let instanceOptions = Object.assign(defaultOptions, options);
    let { connectionUri, service, meta, saveTimeout} = instanceOptions;

    let orm;
    let table;

    db.init(connectionUri)
        .then(ormInstance => {
            orm = ormInstance;
            table = orm.define('noto', columns);
            orm.sync();
            return save();
        })
        .catch(err => {
            console.error('Noto-time couldnt connect to db. Please check your connection string and your database.'); // , err);   
        });

    let columns = {
        identifier: { type: db.Sequelize.STRING},
        service: { type: db.Sequelize.STRING },
        meta: { type: db.Sequelize.JSON },
        value: { type: db.Sequelize.INTEGER },
    };

    let logList = [];

    const log = (identifier, value) => {
        logList.push({service, meta, identifier, value});
    };

    const save = async () => {
        try {
            await table.bulkCreate(logList);
        } catch (err) {
            // console.error('Noto-time couldnt write to the database. Got the following error: ', err);
        }
        logList = [];
        setTimeout(save, saveTimeout);
    };

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


