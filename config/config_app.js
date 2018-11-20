const env = process.env.NODE_ENV || 'development';

const development = {
    app: {
        urls: {
        },
        credentials: {
            KHIPU_COLABORATOR_ID: 0,
            KHIPU_KEY: ''
        }

    }
};

const production = {
    app: {
        urls: {
        },
        credentials: {
            KHIPU_COLABORATOR_ID: process.env.KHIPU_COLABORATOR_ID,
            KHIPU_KEY: process.env.KHIPU_KEY
        }
    }
};

const config = {
    development,
    production
};

module.exports = config[env];
