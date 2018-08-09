const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');

const SES = new AWS.SES();
const api = new ApiBuilder();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

api.get('/ping', function() {
    return 'pong';
});

api.post('/webhook', function(req) {
    if (req.body.action !== 'opened') {
        console.log('not an PR... will shut down');
        return;
    }

    let msg = '';
    for (const key in req.body) {
        msg += key + ': ' + JSON.stringify(req.body[key]) + '\n';
    }

    const email = {
        Source: sender,
        Destination: { ToAddresses: [recipient] },
        Message: { Subject: { Data: subject }, Body: { Text: { Data: msg } } }
    };
    return SES.sendEmail(email)
        .then(function() {
            console.log('it went ok');

            return { status: 'OK' };
        })
        .catch(function(err) {
            console.log('Error sending mail: ' + err);
            return { status: 'ERROR' };
        });
});

module.exports = api;
