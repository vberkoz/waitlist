import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export class StorageStack extends cdk.Stack {
  public readonly table: dynamodb.Table

  public readonly buckets: {
    assets: s3.Bucket
  }

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.table = new dynamodb.Table(this, 'WaitlistTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING }
    })

    this.buckets = {
      assets: new s3.Bucket(this, 'AssetsBucket', {
        bucketName: undefined,
        versioned: false,
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        cors: [
          {
            allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
            maxAge: 3600
          }
        ],
        lifecycleRules: [
          {
            id: 'DeleteOldExports',
            prefix: 'exports/',
            expiration: cdk.Duration.days(30),
            enabled: true
          }
        ],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
      })
    }

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: this.buckets.assets.bucketName,
      description: 'S3 bucket for static assets and exports'
    })

    new cdk.CfnOutput(this, 'AssetsBucketArn', {
      value: this.buckets.assets.bucketArn,
      description: 'S3 bucket ARN'
    })
  }
}
