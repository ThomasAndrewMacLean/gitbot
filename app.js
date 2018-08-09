const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');

const api = new ApiBuilder();
const SES = new AWS.SES();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

api.get('/ping', function() {
    return 'pong';
});

api.post('/webhook', function(req) {
    if (req.body.action !== 'opened') {
        console.log(`this is a ${req.body.action}, not an PR... will shut down`);
        return;
    }

    const PR = req.body.pull_request;

    if (PR && PR.labels.length !== 0) {
        const url = PR.issue_url + '/labels';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(['bug', 'question']),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.githubToken
            }
        });
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
        .promise()
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
