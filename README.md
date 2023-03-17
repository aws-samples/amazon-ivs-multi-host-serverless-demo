# Amazon IVS Multi-host Serverless Demo

This readme includes instructions for deploying the Amazon IVS Multi-host Serverless Demo to an AWS Account. This serverless application supports the following Amazon IVS demos:

- [Amazon IVS Multi-host for iOS Demo](https://github.com/aws-samples/amazon-ivs-multi-host-for-ios-demo)
- [Amazon IVS Multi-host for Android Demo](https://github.com/aws-samples/amazon-ivs-multi-host-for-android-demo)

**\*IMPORTANT NOTE:** Deploying this demo application in your AWS account will create and consume AWS resources, which will cost money.\*

## Application overview

<img src="app-architecture.png" alt="A diagram showing the architecture of the application." />

A full description of the diagram is available in the [architecture description](./architecture-description.md).

## Prerequisites

- [AWS CLI Version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [NodeJS](https://nodejs.org/en/) and `npm` (npm is usually installed with NodeJS).
  - If you have [node version manager](https://github.com/nvm-sh/nvm) installed, run `nvm use` to sync your node version with this project.
- Access to an AWS Account with at least the following permissions:
  - Create IAM roles
  - Create Lambda Functions
  - Create Amazon IVS Channels, Stages, and Chat rooms
  - Create Amazon S3 Buckets
  - Create Amazon DynamoDB Tables

### Configure the AWS CLI

Before you start, run the following command to make sure you're in the correct AWS account (or configure as needed):

```bash
aws configure
```

For configuration specifics, refer to the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

## Run this app locally

To run the app locally, first install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions) and [Docker](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html#install-docker-instructions). With AWS SAM CLI installed and Docker running on your machine, take the following steps:

1. Install the required packages: `npm install`
2. Bootstrap the required resources: `npm run bootstrap`
3. Run the application: `sam local start-api -t ./cdk.out/AmazonIVSMultiHostServerlessStack.template.json`

## Deploy this app to AWS

With NodeJS and NPM installed, take the following steps:

1. Install the required packages: `npm install`
2. Bootstrap the required resources: `npm run bootstrap`
3. Run the application: `npm run deploy`

### Use your deployed backend in the client applications

When the deployment successfully completes, copy the URL provided in the `Outputs` of the script. The URL will be similar to the following format:

```bash
https://<ID>.execute-api.<REGION>.amazonaws.com/prod/
```

This URL can be used to run the following demo applications:

- [Amazon IVS Multi-host for iOS Demo](https://github.com/aws-samples/amazon-ivs-multi-host-for-ios-demo)
- [Amazon IVS Multi-host for Android Demo](https://github.com/aws-samples/amazon-ivs-multi-host-for-android-demo)

### Accessing the deployed application

If needed, you can retrieve the Cloudformation stack outputs by running the following command:

```bash
aws cloudformation describe-stacks --stack-name AmazonIVSMultiHostServerlessStack \
--query 'Stacks[].Outputs'
```

## Cleanup

To delete all resources associated with this demo, **including the DynamoDB table!** run the following command:

```base
npm run destroy
```

This command may not delete all associated Amazon IVS stages, channels, or chat rooms. Visit the [Amazon IVS web console](https://console.aws.amazon.com/ivs/) to delete any lingering resources.

## Known issues

- In some instances, the Amazon IVS stage, channel, or room may fail to delete. To remove resources manually, look for resources tagged with the key `AmazonIVSDemoResource` and value `AmazonIVSMultiHostResource`.
