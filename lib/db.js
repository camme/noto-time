const Sequelize = require('sequelize');

let sequelize;

const init = async (connectionUri) => {

    sequelize = new Sequelize(connectionUri, {
        logging: false,
        define: {
            freezeTableName: true
        }
    });

    return sequelize
        .authenticate()
        .then(() => {
            return sequelize;
        })
        .catch(err => {
            throw err;
        });

};

exports.init = init;
exports.Sequelize = Sequelize;


