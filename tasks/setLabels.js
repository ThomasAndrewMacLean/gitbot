const fetch = require('node-fetch');

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

module.exports = setLabels;