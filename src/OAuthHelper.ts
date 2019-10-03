import SessionRepo = require("./SessionRepo");
import * as OAuth from "oauth";
const oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  "1.0A",
  null,
  "HMAC-SHA1"
);

const requestTokenPromise = (): Promise<{
  token: string;
  tokenSecret: string;
}> => {
  return new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
      if (error) {
        console.log("Error getting OAuth Request Token");
        reject(error);
      } else {
        resolve({
          token,
          tokenSecret
        });
      }
    });
  });
};

const accessTokenPromise = ({
  token,
  tokenSecret,
  verifier
}: {
  token: string;
  tokenSecret: string;
  verifier: string;
}): Promise<{ accessToken: string; accessTokenSecret: string }> => {
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
            accessTokenSecret
          });
        }
      }
    );
  });
};

interface Token {
  token: string;
  tokenSecret: string;
  clientId?: string;
  state?: string;
}

export const requestToken = async (clientId: string, state: string) => {
  try {
    const { token, tokenSecret }: Token = await requestTokenPromise();
    return SessionRepo.saveSession({ token, tokenSecret, clientId, state });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const accessToken = async (token: string, verifier: string) => {
  try {
    const result = await SessionRepo.getSession(token);
    const { tokenSecret, clientId, state }: Token = result.Item;
    const { accessToken, accessTokenSecret } = await accessTokenPromise({
      token,
      tokenSecret,
      verifier
    });

    return {
      accessToken,
      accessTokenSecret,
      clientId,
      state
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
