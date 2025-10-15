import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface ApiStackProps extends cdk.StackProps {
  functions: {
    createWaitlist: lambda.Function
    listWaitlists: lambda.Function
    createSubscriber: lambda.Function
    listSubscribers: lambda.Function
  }
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    this.api = new apigateway.RestApi(this, 'WaitlistApi', {
      restApiName: 'Waitlist API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    })

    const waitlists = this.api.root.addResource('waitlists')
    waitlists.addMethod('POST', new apigateway.LambdaIntegration(props.functions.createWaitlist))
    waitlists.addMethod('GET', new apigateway.LambdaIntegration(props.functions.listWaitlists))

    const subscribers = this.api.root.addResource('subscribers')
    subscribers.addMethod('POST', new apigateway.LambdaIntegration(props.functions.createSubscriber))
    subscribers.addMethod('GET', new apigateway.LambdaIntegration(props.functions.listSubscribers))

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL'
    })
  }
}
