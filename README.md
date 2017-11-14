# serverless-twitter-oauth

[![Known Vulnerabilities](https://snyk.io/test/github/josephyi/serverless-twitter-oauth/badge.svg)](https://snyk.io/test/github/josephyi/serverless-twitter-oauth)

Serverless implementation of Twitter's OAuth to Alexa's Account Link flow. Inspired by [Big Nerd Ranch's Ruby/Sinatra example](https://github.com/bignerdranch/alexa-account-linking-service), which served as a great reference.

## Project Overview
* AWS
  * Lambda
    * `request_token.js` - Gets request tokens and redirects to Twitter authorize app page.
    * `callback.js` - Gets access tokens and redirects to Alexa skill link page.
  * API Gateway
    * provides HTTPS endpoints for the Lambdas
  * DynamoDB
    * Session store

## Prerequisites
* Node 6.10
* [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
  * ```npm i -g serverless```
* [Twitter App](https://apps.twitter.com/app/new)
  * Create app to get consumer key and consumer secret key.
* [Alexa Console](https://developer.amazon.com/edw/home.html#/skills)
  * Set Account Linking to 'Yes'
  * Set Authorization Grant Type to 'Implicit Grant'
  * Note the Redirect URLs. You'll need it for configuring the build.

## Configure
A template configuration file has been provided. Copy it and modify the values accordingly.

```cp env.yml.template env.yml```

The Twitter Key and Secret can be found under the Keys and Access Tokens tab:

![Twitter App Keys](https://user-images.githubusercontent.com/1994863/32765279-90bc2892-c8be-11e7-9875-57c9783b91a1.png)

```yml
default_env: &default_env
  TWITTER_KEY: 'ShoUlDbeS0m3thIngL1keTh15'
  TWITTER_SECRET: 'AnDth3N50m3th1nGlik3Thi5555555555555555'
  REDIRECT_URL: 'https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=ALEXASKILLCONFIG'
dev:
  <<: *default_env
prod:
  <<: *default_env
```

The Redirect URL is found in your Alexa Skill's Configuration section under Account Linking. Once these settings are configured, deploy using the serverless library.

## Deploy

To deploy, run:

```sls deploy```

Output will look something like:

```
$ sls deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (5.58 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
....................
Serverless: Stack update finished...
Service Information
service: twitter-oauth
stage: dev
region: us-east-1
stack: twitter-oauth-dev
api keys:
  None
endpoints:
  GET - https://somegibberish.execute-api.us-east-1.amazonaws.com/dev/request_token
  GET - https://somegibberish.execute-api.us-east-1.amazonaws.com/dev/callback
functions:
  request_token: twitter-oauth-dev-request_token
  callback: twitter-oauth-dev-callback
```

Note the endpoints. You will use the ```request_token``` endpoint in the Authorization URL field of your Alexa Skill's Account Linking configuration, and the ```callback``` endpoint in the Callback URL field of your Twitter App settings.

By default, serverless framework uses the ```dev``` stage. You can choose a different stage and other options. [See documentation](https://serverless.com/framework/docs/providers/aws/guide/deploying/) for details.
