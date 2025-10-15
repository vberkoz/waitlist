import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

interface ComputeStackProps extends cdk.StackProps {
  tables: {
    waitlists: dynamodb.Table
    subscribers: dynamodb.Table
  }
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
      createWaitlist: new lambda.Function(this, 'CreateWaitlistFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "OK" })'),
        environment: {
          WAITLISTS_TABLE: props.tables.waitlists.tableName
        }
      }),
      listWaitlists: new lambda.Function(this, 'ListWaitlistsFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "OK" })'),
        environment: {
          WAITLISTS_TABLE: props.tables.waitlists.tableName
        }
      }),
      createSubscriber: new lambda.Function(this, 'CreateSubscriberFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "OK" })'),
        environment: {
          SUBSCRIBERS_TABLE: props.tables.subscribers.tableName
        }
      }),
      listSubscribers: new lambda.Function(this, 'ListSubscribersFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "OK" })'),
        environment: {
          SUBSCRIBERS_TABLE: props.tables.subscribers.tableName
        }
      })
    }

    props.tables.waitlists.grantReadWriteData(this.functions.createWaitlist)
    props.tables.waitlists.grantReadData(this.functions.listWaitlists)
    props.tables.subscribers.grantReadWriteData(this.functions.createSubscriber)
    props.tables.subscribers.grantReadData(this.functions.listSubscribers)
  }
}
