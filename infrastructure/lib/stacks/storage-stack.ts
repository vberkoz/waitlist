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
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
      })
    }
  }
}
