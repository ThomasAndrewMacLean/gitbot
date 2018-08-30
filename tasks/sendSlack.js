const fetch = require('node-fetch');

const sendSlack = PR => {
    //GET SLACKURL FROM PR
    return fetch(
        'https://hooks.slack.com/services/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',
        {
            method: 'POST',
            body: JSON.stringify({
                text: `new pull request to be reviewed! PR: ${PR.title}`
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.GITHUBTOKEN
            }
        }
    )
        .then(() => {
            console.log('SEND SLACK');
        })
        .catch(err => {
            console.log('ERROR: SLACK NOT SENT');
            console.log(err);
        });
};

module.exports = sendSlack;
