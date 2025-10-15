import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

interface ComputeStackProps extends cdk.StackProps {
  table: dynamodb.Table
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
          TABLE_NAME: props.table.tableName
        }
      }),
      listWaitlists: new NodejsFunction(this, 'ListWaitlistsFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/waitlists/list.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName
        }
      }),
      createSubscriber: new NodejsFunction(this, 'CreateSubscriberFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/subscribers/create.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName
        }
      }),
      listSubscribers: new NodejsFunction(this, 'ListSubscribersFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/functions/subscribers/list.ts'),
        handler: 'handler',
        environment: {
          TABLE_NAME: props.table.tableName
        }
      })
    }

    props.table.grantReadWriteData(this.functions.createWaitlist)
    props.table.grantReadData(this.functions.listWaitlists)
    props.table.grantReadWriteData(this.functions.createSubscriber)
    props.table.grantReadData(this.functions.listSubscribers)
  }
}
