#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { StorageStack } from '../lib/stacks/storage-stack'
import { ComputeStack } from '../lib/stacks/compute-stack'
import { ApiStack } from '../lib/stacks/api-stack'
import { CognitoStack } from '../lib/stacks/cognito-stack'

const app = new cdk.App()

const storageStack = new StorageStack(app, 'WaitlistStorageStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})

const cognitoStack = new CognitoStack(app, 'WaitlistCognitoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})

const computeStack = new ComputeStack(app, 'WaitlistComputeStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  table: storageStack.table,
  assetsBucket: storageStack.buckets.assets,
  userPoolId: cognitoStack.userPool.userPoolId,
  userPoolClientId: cognitoStack.userPoolClient.userPoolClientId
})

new ApiStack(app, 'WaitlistApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  functions: computeStack.functions
})
