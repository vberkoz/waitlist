import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53targets from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'

interface ApiStackProps extends cdk.StackProps {
  functions: {
    createWaitlist: lambda.Function
    listWaitlists: lambda.Function
    getWaitlist: lambda.Function
    deleteWaitlist: lambda.Function
    createSubscriber: lambda.Function
    listSubscribers: lambda.Function
    deleteSubscriber: lambda.Function
    exportSubscribers: lambda.Function
    createApiKey: lambda.Function
    validateApiKey: lambda.Function
    login: lambda.Function
    verifyToken: lambda.Function
    cognitoLogin: lambda.Function
    cognitoVerify: lambda.Function
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
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
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

    const waitlistById = waitlists.addResource('{id}')
    waitlistById.addMethod('DELETE', new apigateway.LambdaIntegration(props.functions.deleteWaitlist), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '404' },
        { statusCode: '403' },
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

    const subscriberById = subscribers.addResource('{id}')
    subscriberById.addMethod('DELETE', new apigateway.LambdaIntegration(props.functions.deleteSubscriber), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '404' },
        { statusCode: '500' }
      ]
    })

    const exportSubscribers = subscribers.addResource('export')
    exportSubscribers.addMethod('POST', new apigateway.LambdaIntegration(props.functions.exportSubscribers), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '500' }
      ]
    })

    const auth = this.api.root.addResource('auth')
    const apiKeys = auth.addResource('apikeys')
    apiKeys.addMethod('POST', new apigateway.LambdaIntegration(props.functions.createApiKey), {
      methodResponses: [
        { statusCode: '201' },
        { statusCode: '400' },
        { statusCode: '500' }
      ]
    })
    
    const validateKey = auth.addResource('validate')
    validateKey.addMethod('POST', new apigateway.LambdaIntegration(props.functions.validateApiKey), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '401' },
        { statusCode: '500' }
      ]
    })

    const login = auth.addResource('login')
    login.addMethod('POST', new apigateway.LambdaIntegration(props.functions.login), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '401' },
        { statusCode: '500' }
      ]
    })

    const verify = auth.addResource('verify')
    verify.addMethod('GET', new apigateway.LambdaIntegration(props.functions.verifyToken), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '401' },
        { statusCode: '500' }
      ]
    })

    const cognitoLogin = auth.addResource('cognito-login')
    cognitoLogin.addMethod('POST', new apigateway.LambdaIntegration(props.functions.cognitoLogin), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '401' },
        { statusCode: '500' }
      ]
    })

    const cognitoVerify = auth.addResource('cognito-verify')
    cognitoVerify.addMethod('GET', new apigateway.LambdaIntegration(props.functions.cognitoVerify), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '401' },
        { statusCode: '500' }
      ]
    })

    const waitlistSlug = this.api.root.addResource('{slug}')
    waitlistSlug.addMethod('GET', new apigateway.LambdaIntegration(props.functions.getWaitlist), {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '404' },
        { statusCode: '500' }
      ]
    })

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'vberkoz.com'
    })

    const certificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName: '*.waitlist.vberkoz.com',
      subjectAlternativeNames: ['waitlist.vberkoz.com'],
      validation: acm.CertificateValidation.fromDns(hostedZone)
    })

    const customDomain = new apigateway.DomainName(this, 'CustomDomain', {
      domainName: 'project.waitlist.vberkoz.com',
      certificate,
      endpointType: apigateway.EndpointType.REGIONAL,
      securityPolicy: apigateway.SecurityPolicy.TLS_1_2
    })

    new apigateway.BasePathMapping(this, 'BasePathMapping', {
      domainName: customDomain,
      restApi: this.api,
      stage: this.api.deploymentStage
    })

    new route53.ARecord(this, 'ApiAliasRecord', {
      zone: hostedZone,
      recordName: 'project.waitlist',
      target: route53.RecordTarget.fromAlias(
        new route53targets.ApiGatewayDomain(customDomain)
      )
    })

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL'
    })

    new cdk.CfnOutput(this, 'CustomDomainUrl', {
      value: `https://project.waitlist.vberkoz.com`,
      description: 'Custom Domain URL'
    })
  }
}
