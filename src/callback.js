const OAuthHelper = require("./OAuthHelper");

exports.handler = async (event, context, callback) => {
  const { oauth_token, oauth_verifier } = event.queryStringParameters;

  try {
    const {
      accessToken,
      accessTokenSecret,
      state,
      clientId
    } = await OAuthHelper.accessToken(oauth_token, oauth_verifier);
    const redirectUrl = `${process.env.REDIRECT_URL}#access_token=${accessToken},${accessTokenSecret}&state=${state}&client_id=${clientId}&response_type=Bearer`;
    return {
      statusCode: 302,
      body: "",
      headers: {
        Location: redirectUrl
      }
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: `Server error.`
    };
  }
};
