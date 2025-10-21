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
  public readonly apiFunction: lambda.Function

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props)

    this.apiFunction = new NodejsFunction(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/lambda.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        TABLE_NAME: props.table.tableName,
        ASSETS_BUCKET: props.assetsBucket.bucketName,
        JWT_SECRET: 'your-jwt-secret-key-change-in-production',
        ADMIN_EMAIL: 'admin@waitlist.com',
        ADMIN_PASSWORD_HASH: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        COGNITO_USER_POOL_ID: props.userPoolId || '',
        COGNITO_CLIENT_ID: props.userPoolClientId || ''
      }
    })

    this.apiFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query',
        'dynamodb:Scan'
      ],
      resources: [props.table.tableArn, `${props.table.tableArn}/index/*`]
    }))

    this.apiFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject', 's3:GetObject', 's3:PutObjectAcl', 's3:ListBucket'],
      resources: [props.assetsBucket.bucketArn, `${props.assetsBucket.bucketArn}/*`]
    }))

    this.apiFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito-idp:InitiateAuth', 'cognito-idp:GetUser'],
      resources: ['*']
    }))
  }
}
