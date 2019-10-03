import OAuthHelper = require("./OAuthHelper");

export const handler = async event => {
  const { oauth_token, oauth_verifier } = event.queryStringParameters;

  try {
    const response = await OAuthHelper.accessToken(oauth_token, oauth_verifier);
    const { accessToken, accessTokenSecret, state, clientId } = response;
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
