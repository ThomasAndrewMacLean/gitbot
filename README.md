# gitbot

### howto

- install all dependecies with yarn install
- follow the guide on [claudia.js](https://claudiajs.com/tutorials/installing.html). It will guide you to get credentials on AWS
- in package.json change the --profile from claudiaJS to your own profile name
- if you can use the default, this will let u use ```yarn log``` to view the AWS logs
- change the region to your own in the package.json and in the policies/send-email.json file
- install [the aws cli tools](https://aws.amazon.com/cli/)
- verify your email ```aws ses verify-email-identity --email-address YOUR@EMAIL.ADDRESS```
- in app.js put in your own emailaddress
- run ```yarn first-deploy``` this will return your url endpoint in the console
- test it by surfing to this url + /ping it should return pong