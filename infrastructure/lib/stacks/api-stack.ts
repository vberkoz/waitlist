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
      description: 'Waitlist Management API',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token'
        ],
        allowCredentials: true,
        maxAge: cdk.Duration.hours(1)
      }
    })

    const waitlists = this.api.root.addResource('waitlists')
    waitlists.addMethod('POST', new apigateway.LambdaIntegration(props.functions.createWaitlist), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '400' },
        { statusCode: '500' }
      ]
    })
    waitlists.addMethod('GET', new apigateway.LambdaIntegration(props.functions.listWaitlists), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '500' }
      ]
    })

    const subscribers = this.api.root.addResource('subscribers')
    subscribers.addMethod('POST', new apigateway.LambdaIntegration(props.functions.createSubscriber), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '400' },
        { statusCode: '500' }
      ]
    })
    subscribers.addMethod('GET', new apigateway.LambdaIntegration(props.functions.listSubscribers), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '500' }
      ]
    })

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL'
    })
  }
}
