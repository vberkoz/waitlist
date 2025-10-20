import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

interface ComputeStackProps extends cdk.StackProps {
  table: dynamodb.Table
  assetsBucket: s3.Bucket
  userPoolId?: string
  userPoolClientId?: string
}

export class ComputeStack extends cdk.Stack {
  public readonly functions: {
    createWaitlist: lambda.Function
    listWaitlists: lambda.Function
    createSubscriber: lambda.Function
    listSubscribers: lambda.Function
    exportSubscribers: lambda.Function
    createApiKey: lambda.Function
    validateApiKey: lambda.Function
    login: lambda.Function
    verifyToken: lambda.Function
    cognitoLogin: lambda.Function
    cognitoVerify: lambda.Function
  }

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props)

    this.functions = {
      createWaitlist: new NodejsFunction(this, 'CreateWaitlistFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/waitlists/create.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName,
          JWT_SECRET: 'your-jwt-secret-key-change-in-production'
        }
      }),
      listWaitlists: new NodejsFunction(this, 'ListWaitlistsFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/waitlists/list.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName,
          JWT_SECRET: 'your-jwt-secret-key-change-in-production'
        }
      }),
      createSubscriber: new NodejsFunction(this, 'CreateSubscriberFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/subscribers/create.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      listSubscribers: new NodejsFunction(this, 'ListSubscribersFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/subscribers/list.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      exportSubscribers: new NodejsFunction(this, 'ExportSubscribersFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/subscribers/export.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      createApiKey: new NodejsFunction(this, 'CreateApiKeyFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/create-apikey.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      validateApiKey: new NodejsFunction(this, 'ValidateApiKeyFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/validate-apikey.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      login: new NodejsFunction(this, 'LoginFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/login.ts'),
        handler: 'handler',
        environment: {
          ADMIN_EMAIL: 'admin@waitlist.com',
          ADMIN_PASSWORD_HASH: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
          JWT_SECRET: 'your-jwt-secret-key-change-in-production'
        }
      }),
      verifyToken: new NodejsFunction(this, 'VerifyTokenFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/verify.ts'),
        handler: 'handler',
        environment: {
          JWT_SECRET: 'your-jwt-secret-key-change-in-production'
        }
      }),
      cognitoLogin: new NodejsFunction(this, 'CognitoLoginFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/cognito-login.ts'),
        handler: 'handler',
        environment: {
          COGNITO_USER_POOL_ID: props.userPoolId || '',
          COGNITO_CLIENT_ID: props.userPoolClientId || ''
        }
      }),
      cognitoVerify: new NodejsFunction(this, 'CognitoVerifyFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/auth/cognito-verify.ts'),
        handler: 'handler'
      })
    }

    this.functions.createWaitlist.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: [props.table.tableArn]
    }))

    this.functions.listWaitlists.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Query', 'dynamodb:Scan'],
      resources: [props.table.tableArn, `${props.table.tableArn}/index/*`]
    }))

    this.functions.createSubscriber.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:Scan'],
      resources: [props.table.tableArn]
    }))

    this.functions.listSubscribers.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Query', 'dynamodb:Scan'],
      resources: [props.table.tableArn, `${props.table.tableArn}/index/*`]
    }))

    this.functions.createWaitlist.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject', 's3:PutObjectAcl'],
      resources: [`${props.assetsBucket.bucketArn}/*`]
    }))

    this.functions.listWaitlists.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject', 's3:ListBucket'],
      resources: [props.assetsBucket.bucketArn, `${props.assetsBucket.bucketArn}/*`]
    }))

    this.functions.createSubscriber.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject', 's3:GetObject'],
      resources: [`${props.assetsBucket.bucketArn}/exports/*`]
    }))

    this.functions.listSubscribers.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [`${props.assetsBucket.bucketArn}/exports/*`]
    }))

    this.functions.exportSubscribers.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Query'],
      resources: [props.table.tableArn, `${props.table.tableArn}/index/*`]
    }))

    this.functions.exportSubscribers.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject', 's3:GetObject'],
      resources: [`${props.assetsBucket.bucketArn}/exports/*`]
    }))

    this.functions.createApiKey.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
      resources: [props.table.tableArn]
    }))

    this.functions.validateApiKey.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:Scan'],
      resources: [props.table.tableArn]
    }))

    this.functions.cognitoLogin.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito-idp:InitiateAuth'],
      resources: ['*']
    }))

    this.functions.cognitoVerify.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito-idp:GetUser'],
      resources: ['*']
    }))
  }
}
