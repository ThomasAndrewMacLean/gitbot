const crypto = require('crypto');

const verify = req => {
    const secret = process.env.GITWEBHOOKSECRET;
    const payload = JSON.stringify(req.body);
    const signature = req.headers['X-Hub-Signature'];

    const computedSignature = `sha1=${crypto
        .createHmac('sha1', secret)
        .update(payload)
        .digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
};

module.exports = verify;
