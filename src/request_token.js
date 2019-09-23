const OAuthHelper = require("./OAuthHelper");

exports.handler = async event => {
  const { client_id, state } = event.queryStringParameters;

  try {
    const token = await OAuthHelper.requestToken(client_id, state);
    return {
      statusCode: 302,
      headers: {
        Location: `https://twitter.com/oauth/authorize?oauth_token=${token}`
      },
      body: ""
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: `Server error.`
    };
  }
};
