import {DynamoDB} from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();

export const saveSession = ({ token, tokenSecret, clientId, state }) => {
  const timestamp = new Date().getTime();
  const entry = {
    TableName: process.env.DYNAMODB_TABLE || '',
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

export const getSession = (id): any => {
  console.log(`id is ${id}`);
  const params = {
    TableName: process.env.DYNAMODB_TABLE || '',
    Key: {
      id
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        console.log(`data is ${JSON.stringify(data)}`);
        resolve(data);
      }
    });
  });
};
