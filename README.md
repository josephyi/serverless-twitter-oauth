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

Edit the file with your values accordingly:

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

## Deploy

To deploy, run:

```sls deploy```

By default, serverless framework uses the ```dev``` stage. You can choose a different stage and other options. [See documentation](https://serverless.com/framework/docs/providers/aws/guide/deploying/) for details.
