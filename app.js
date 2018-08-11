const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const verifyGithubWebhook = require('verify-github-webhook');

const api = new ApiBuilder();
const SES = new AWS.SES();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

api.get('/ping', () => {
    return 'pong';
});
api.get('/test', req => {
    return verifyGithubWebhook(
        req.headers['x-hub-signature'],
        JSON.stringify(req.body),
        process.env.GITWEBHOOKSECRET
    );
});

api.post('/webhook', req => {
    console.log(req.headers['x-hub-signature']);
    console.log(process.env.GITWEBHOOKSECRET);
    if (
        !verifyGithubWebhook(
            req.headers['x-hub-signature'],
            JSON.stringify(req.body),
            process.env.GITWEBHOOKSECRET
        )
    ) {
        console.log('NOT SIGNED!');
        return;
    }
    if (req.body.action !== 'opened') {
        console.log(`this is a ${req.body.action}, not a new PR... will shut down`);
        return;
    }

    const PR = req.body.pull_request;

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
            return fetch(PR.issue_url + '/labels', {
                method: 'POST',
                body: JSON.stringify(['bug', 'question']),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + process.env.GITHUBTOKEN
                }
            })
                .then(d => {
                    console.log(d);
                    PR.body = PR.body.replace('test', 'production');

                    return fetch(PR.url, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            body: PR.body + '\n\n\n\n I can append this to the original body'
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + process.env.githubToken
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(function(err) {
            console.log('Error sending mail: ' + err);
            return { status: 'ERROR' };
        });
});

module.exports = api;
