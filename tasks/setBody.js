const fetch = require('node-fetch');

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

module.exports = setBody;
