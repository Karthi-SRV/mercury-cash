const Sequelize = require('sequelize');
let sequelize;
module.exports.connect = (dbConfig, callback) => {
    const self = this;
    self.sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            timestamps: false,
        },
    });

    self.sequelize
        .authenticate()
        .then(() => {
            console.info('%s: db default connection connected... ', new Date());
            callback(this.sequelize);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    process.on('SIGINT', function() {
        self.sequelize.close().then(function() {
            console.log("V!ZZ App stopped... ");
        })
    });

}

module.exports.sequelize = sequelize;