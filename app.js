const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

const api = new ApiBuilder();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@gmail.com';
const subject = 'gitbot says hello!';

api.get('/ping', function() {
    return 'pong';
});

api.post('/webhook', function(req) {
    // if (req.body.action !== 'opened') {
    console.log(`this is a ${req.body.action}not an PR... will shut down`);
    // return;
    //}

    let msg = '';
    for (const key in req.body) {
        msg += key + ': ' + JSON.stringify(req.body[key]) + '\n';
    }

    const email = {
        Source: sender,
        Destination: { ToAddresses: [recipient] },
        Message: { Subject: { Data: subject }, Body: { Text: { Data: msg } } }
    };

    const SES = new AWS.SES();
    SES.sendEmail(email, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
    // const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(email).promise();

    // sendPromise
    //     .then(function(data) {
    //         console.log(data.MessageId);
    //     })
    //     .catch(function(err) {
    //         console.error(err, err.stack);
    //     });

    // SES.sendEmail(email)
    //     .promise.then(function() {
    //         console.log('it went ok');

    //         return { status: 'OK' };
    //     })
    //     .catch(function(err) {
    //         console.log('Error sending mail: ' + err);
    //         return { status: 'ERROR' };
    //     });
});

module.exports = api;
