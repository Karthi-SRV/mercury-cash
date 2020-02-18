'use strict';

const config = require('.././');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const expressJwt = require('express-jwt');
const JWTSecretKey = require('../../config/env/dev').JWTSecretKey;
const cookieParser = require('cookie-parser');
const CONSTANTS = require('../../app/utils/constants');

// initialize middlewares
module.exports.initMiddleware = (app) => {

    app.use(cookieParser());
    app.use(helmet());
    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));
    app.use(methodOverride());
    const corsOptions = {
        origin: config.frontEndUrl,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: [ 'Content-Type' ],
    };
    app.use(cors(corsOptions));
    const trimmer = (req, res, next) => {
        req.body = _.fromPairs(_.map(_.get(req, 'body', ''), (value, key) => {
            if (_.isString(value)) {
                return [ key, value.trim() ];
            }
            return [ key, value ];
        }));
        next();
    };
    app.use(trimmer);
};

module.exports.initJwt = (app) => {
    app.use(expressJwt({
        secret: JWTSecretKey,
        getToken: function(req) {
            if (req.cookies[CONSTANTS.cookieName['qualified-purchaser']]) {
                return req.cookies[CONSTANTS.cookieName['qualified-purchaser']];
            }
            if (req.cookies[CONSTANTS.cookieName.broker]) {
                return req.cookies[CONSTANTS.cookieName.broker];
            }
            if (req.cookies[CONSTANTS.cookieName.admin]) {
                return req.cookies[CONSTANTS.cookieName.admin];
            }
            if (req.cookies[CONSTANTS.cookieName.issuance]) {
                return req.cookies[CONSTANTS.cookieName.issuance];
            }
            return null;
        },
    }).unless({
        path: [
            { url: /^\/api\/.*/, methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ] },
        ],
    }));
};

// Helmet configurations
module.exports.initHelmetHeaders = (app) => {
    // Use helmet to secure Express headers
    var SIX_MONTHS = 15778476000;
    app.use(helmet.xssFilter());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubDomains: true,
        force: true,
    }));
    app.disable('x-powered-by');
};

// Server Routes
module.exports.initModulesServerRoutes = (app) => {
    var router = express.Router();
    // Globbing All Routes files
    config.getGlobbedPaths([
        'app/routes/*.routes.js',
    ])
        .forEach((routePath) => {
            require(path.resolve(routePath))(router);
        });

    app.use(config.urlPrefix, router);
};

// Error Routes
module.exports.initErrorRoutes = (app) => {
    // Handle Routes Error
    app.use((err, req, res, next) => {
        // If the error object doesn't exists
        if (!err) {
            return next();
        } else if (err.name !== undefined && err.name === 'UnauthorizedError') {
            return res.status(401).send({ status: 'fail', message: 'Invalid Token' });
        }
        // Log it
        console.error(err.stack);
        res.status(500).json({ error: err.stack });
    });
};

// Termination handler
module.exports.terminator = (sig) => {
    if (typeof sig === 'string') {
        console.log('%s: Received %s - terminating mercury app ...', Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Mercury Server Stopped.', Date(Date.now()));
};

module.exports.setupTerminationHandlers = () => {
    var self = this;

    process.on('exit', () => {
        self.terminator();
    });

    [ 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
    ].forEach((element) => {
        process.on(element, () => {
            self.terminator(element);
        });
    });
};

module.exports.setupUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        console.log(new Date().toString(), err.stack || err);
        process.kill(process.pid, 'SIGKILL');
    });
};

module.exports.setupUnhandledRejection = () => {
    process.on('unhandledRejection', (err) => {
        console.log(new Date().toString(), err.stack || err);
        process.kill(process.pid, 'SIGKILL');
    });
};

module.exports.initWinstonLogger = (app) => {
    require('./middleware')(app);
};

module.exports.initMongooseSchemas = () => {
    config.getGlobbedPaths([
        'server/app/models/*.js',
    ])
        .forEach((routePath) => {
            require(path.resolve(routePath));
        });
};

/**
 * Initialize the Express application
 */
module.exports.init = (db) => {
    // Initialize express app
    var app = express();

    // Initialize Express middleware
    this.initMiddleware(app);

    // use JWT auth to secure the api, the token can be passed in the authorization header or querystring
    this.initJwt(app);
    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Winston logger
    this.initWinstonLogger(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    this.initMongooseSchemas();

    // Initialize Signal Handlers
    this.setupTerminationHandlers();
    this.setupUncaughtException();
    this.setupUnhandledRejection();

    // Initialize modules server routes
    this.initModulesServerRoutes(app);
    return app;
};
