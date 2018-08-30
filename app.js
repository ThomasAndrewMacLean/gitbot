const ApiBuilder = require('claudia-api-builder');
const verify = require('./security/verify');
const sendEmail = require('./tasks/sendEmail');
const setLabels = require('./tasks/setLabels');
const sendSlack = require('./tasks/sendSlack');
const setBody = require('./tasks/setBody');
const db = require('monk')(
    `mongodb://dbreadwrite:${
        process.env.MONGO_PW
    }@ds139992.mlab.com:39992/gitbot`
);
const users = db.get('users');
const api = new ApiBuilder();

api.get('/ping', () => {
    return 'pong!';
});

api.get('/test', () => {
    return users.find({ email: 'thomas.maclean@marlon.be' }).then(user => {
        return { user };
    });
});

api.post('/webhook', req => {
    if (!verify(req) || req.body.action !== 'opened') {
        console.log(
            `this is a ${req.body.action}, not a new PR... will shut down`
        );
        return;
    }

    const PR = req.body.pull_request;
    return Promise.all([
        sendEmail(req),
        setLabels(PR),
        setBody(PR),
        sendSlack(PR)
    ]);
});

module.exports = api;
