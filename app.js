const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

const fs = require('fs');

const AWS = require('aws-sdk-promise');
const SES = new AWS.SES();

const sender = 'Spinscale Form Mailer hello@thomasmaclean.be';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'Form mailer for example.org: New enquiry';

api.get('/hello', function() {
    return 'hello world';
});

api.get('/version', function() {
    return fs.readFileSync('package.json', 'utf8');
});

api.post('/webhook', function(req) {
    let msg = '';
    for (const key in req.post) {
        msg += key + ': ' + req.post[key] + '\n';
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
