# be-template

[![CircleCI](https://circleci.com/gh/jackcohen5/be-template.svg?style=svg)](https://circleci.com/gh/jackcohen5/be-template)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jackcohen5/be-template)](https://dependabot.com)

This template service gives you the latest in modern JavaScript (ES6 via Webpack + Babel, testing with Jest, linting with ESLint, and formatting with Prettier), the ease and power of Serverless, and bootstrapped DynamoDB and S3 infrastructure.

Once installed, you can create and deploy functions with the latest ES6 features in minutes, with linting and formatting baked in.

## TODO

1. Convert unit tests into integration tests, benchmark cost/time penalties of spinning up test environments on CI

## Install

```bash
# Install dependencies
yarn install
```

### Running locally

```bash
# Start local API gateway
yarn start
```

### Test your functions with Jest

Jest is installed as the testrunner. To create a test, co-locate your test with the file it's testing
as `<filename>.test.js` and then run/watch tests with:

```bash
yarn test
```

## Deploy

Assuming you've already set up your default AWS credentials:

```bash
yarn deploy
```

`yarn deploy` will deploy to the `development` environment. You can deploy to `staging` or `production`
with:

```bash
yarn deploy:staging

# -- or --

yarn deploy:production
```

After you've deployed, the output of the deploy script will give you the API endpoint
for your deployed function(s), so you should be able to test the deployed API via that URL.

## Cleaning Up

Assuming you're finished with your environment, you can delete the stack with:

```bash
yarn cleanup
```

`yarn cleanup` will remove the `development` environment.
