import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

interface ComputeStackProps extends cdk.StackProps {
  table: dynamodb.Table
  assetsBucket: s3.Bucket
}

export class ComputeStack extends cdk.Stack {
  public readonly functions: {
    createWaitlist: lambda.Function
    listWaitlists: lambda.Function
    createSubscriber: lambda.Function
    listSubscribers: lambda.Function
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
          ASSETS_BUCKET: props.assetsBucket.bucketName
        }
      }),
      listWaitlists: new NodejsFunction(this, 'ListWaitlistsFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/waitlists/list.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName,
          ASSETS_BUCKET: props.assetsBucket.bucketName
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
      })
    }

    props.table.grantReadWriteData(this.functions.createWaitlist)
    props.table.grantReadData(this.functions.listWaitlists)
    props.table.grantReadWriteData(this.functions.createSubscriber)
    props.table.grantReadData(this.functions.listSubscribers)

    props.assetsBucket.grantReadWrite(this.functions.createWaitlist)
    props.assetsBucket.grantRead(this.functions.listWaitlists)
    props.assetsBucket.grantReadWrite(this.functions.createSubscriber)
    props.assetsBucket.grantRead(this.functions.listSubscribers)
  }
}
