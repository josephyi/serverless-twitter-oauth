const SessionRepo = require("./SessionRepo");
const OAuth = require("oauth").OAuth;
const oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  "1.0A",
  null,
  "HMAC-SHA1"
);

const requestTokenPromise = (clientId, state) => {
  return new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken(
      (error, oauth_token, oauth_token_secret, results) => {
        if (error) {
          console.log("Error getting OAuth Request Token");
          reject(error);
        } else {
          resolve({
            token: oauth_token,
            tokenSecret: oauth_token_secret,
            state: state,
            clientId: clientId
          });
        }
      }
    );
  });
};

const accessTokenPromise = ({
  token,
  tokenSecret,
  verifier,
  clientId,
  state
}) => {
  return new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      token,
      tokenSecret,
      verifier,
      (error, accessToken, accessTokenSecret, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            accessToken,
            accessTokenSecret,
            clientId,
            state
          });
        }
      }
    );
  });
};

exports.requestToken = (clientId, state) => {
  return requestTokenPromise(clientId, state).then(params => {
    const { token, tokenSecret, clientId, state } = params;
    return SessionRepo.saveSession({ token, tokenSecret, clientId, state });
  });
};

exports.accessToken = (token, verifier) => {
  return SessionRepo.getSession(token).then(result => {
    const { tokenSecret, clientId, state } = result.Item;
    return accessTokenPromise({
      token,
      tokenSecret,
      verifier,
      clientId,
      state
    });
  });
};
