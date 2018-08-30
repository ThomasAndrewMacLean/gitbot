const fetch = require('node-fetch');
const db = require('monk')(
    `mongodb://dbreadwrite:${
        process.env.MONGO_PW
    }@ds139992.mlab.com:39992/gitbot`
);
const users = db.get('users');

const sendSlack = PR => {
    //GET SLACKURL FROM PR
    return users
        .find({ email: 'thomas.maclean@marlon.be' })
        .each((user, { close }) => {
            return fetch(
                'https://hooks.slack.com/services/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',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        text: `Slack2222 PR: ${PR.title}`
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(() => {
                    console.log('SEND SLACK');
                    close();
                })
                .catch(err => {
                    console.log('ERROR: SLACK NOT SENT');
                    console.log(err);
                    close();
                });
        });
};

module.exports = sendSlack;
