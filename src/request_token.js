const OAuthHelper = require("./OAuthHelper");

exports.handler = (event, context, callback) => {
  const { client_id, state } = event.queryStringParameters;

  OAuthHelper.requestToken(client_id, state)
    .then(token => {
      callback(null, {
        statusCode: 302,
        headers: {
          Location: `https://twitter.com/oauth/authorize?oauth_token=${token}`
        },
        body: ""
      });
    })
    .catch(error => {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: `Server error.`
      });
    });
};
