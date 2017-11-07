const OAuthHelper = require("./OAuthHelper");

exports.handler = (event, context, callback) => {
  const { oauth_token, oauth_verifier } = event.queryStringParameters;

  OAuthHelper.accessToken(oauth_token, oauth_verifier)
    .then(result => {
      const { accessToken, accessTokenSecret, state, clientId } = result;
      const redirectUrl = `${process.env
        .REDIRECT_URL}#access_token=${accessToken},${accessTokenSecret}&state=${state}&client_id=${clientId}&response_type=Bearer`;
      const response = {
        statusCode: 302,
        body: "",
        headers: {
          Location: redirectUrl
        }
      };
      callback(null, response);
    })
    .catch(error => {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Server error.`
      });
    });
};
