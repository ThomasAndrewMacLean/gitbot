const AWS = require('aws-sdk');

const SES = new AWS.SES();

const sender = 'thomas.maclean@gmail.com';
const recipient = 'thomas.maclean@marlon.be';
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


module.exports = sendEmail;
