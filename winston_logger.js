const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'gptodo' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const requestLogger = (req, res, next) => {
    res.on('finish', async () => {
        const responseMessage = `${res.statusCode} ${res.statusMessage} - ${req.method} ${req.originalUrl}`;

        logger.info(responseMessage);
    });

    next();
};

module.exports = {
    logger,
    requestLogger,
};
