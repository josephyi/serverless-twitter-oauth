const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.saveSession = ({ token, tokenSecret, clientId, state }) => {
  const timestamp = new Date().getTime();
  const entry = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: token,
      tokenSecret,
      state,
      clientId,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.put(entry, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(entry.Item.id);
      }
    });
  });
};

exports.getSession = id => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
