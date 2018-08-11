const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const verify = require('./security/verify');
const api = new ApiBuilder();
const SES = new AWS.SES();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

const sendEmail = req => {
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
        .then(() => {
            console.log('EMAIL SENT');
        })
        .catch(err => {
            console.log('ERROR: EMAIL NOT SENT');
            console.log(err);
        });
};

const setLabels = PR => {
    return fetch(PR.issue_url + '/labels', {
        method: 'POST',
        body: JSON.stringify(['bug', 'question']),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.GITHUBTOKEN
        }
    })
        .then(() => {
            console.log('SET LABELS');
        })
        .catch(err => {
            console.log('ERROR: LABELS NOT SET');
            console.log(err);
        });
};

const setBody = PR => {
    PR.body = PR.body.replace('test', 'production');

    return fetch(PR.url, {
        method: 'PATCH',
        body: JSON.stringify({
            body: PR.body + '\n\n\n\n I can append this to the original body'
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.GITHUBTOKEN
        }
    })
        .then(() => {
            console.log('SET BODY');
        })
        .catch(err => {
            console.log('ERROR: BODY NOT SET');
            console.log(err);
        });
};

api.get('/ping', () => {
    return 'pong';
});

api.post('/webhook', req => {
    console.log('start');

    if (!verify(req)) {
        console.log('NOT SIGNED!');
        return;
    }
    console.log('got by verify');

    if (req.body.action !== 'opened') {
        console.log(`this is a ${req.body.action}, not a new PR... will shut down`);
        return;
    }

    const PR = req.body.pull_request;
    return Promise.all([sendEmail(req), setLabels(PR), setBody(PR)]);
});

module.exports = api;
