const ApiBuilder = require('claudia-api-builder');
const fs = require('fs');
const AWS = require('aws-sdk-promise');

const SES = new AWS.SES();
const api = new ApiBuilder();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

api.get('/hello', function() {
    return 'hello world';
});

api.get('/version', function() {
    return fs.readFileSync('package.json', 'utf8');
});

api.post('/webhook', function(req) {
   
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
        .promise()
        .then(function() {
            return { status: 'OK' };
        })
        .catch(function(err) {
            console.log('Error sending mail: ' + err);
            return { status: 'ERROR' };
        });
});

module.exports = api;
