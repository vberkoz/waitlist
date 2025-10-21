import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53targets from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'

interface ApiStackProps extends cdk.StackProps {
  apiFunction: lambda.Function
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

    const integration = new apigateway.LambdaIntegration(props.apiFunction)
    this.api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true
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
