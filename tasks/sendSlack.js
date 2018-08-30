const fetch = require('node-fetch');
// const db = require('monk')(
//     `mongodb://dbreadwrite:${
//         process.env.MONGO_PW
//     }@ds139992.mlab.com:39992/gitbot`
// );
//const users = db.get('users');

const sendSlack = PR => {
    console.log('GETTING SLACK 🤖');

    //GET SLACKURL FROM PR

    return fetch(
        'https://hooks.slack.com/services/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',
        {
            method: 'POST',
            body: JSON.stringify({
                text: `new pull request to be reviewed!!! PR: ${PR.title}`
            }),
            headers: {
                'Content-Type': 'application/json'
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
