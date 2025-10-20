import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as path from 'path'
import { Construct } from 'constructs'

export class StorageStack extends cdk.Stack {
  public readonly table: dynamodb.Table
  public readonly buckets: {
    assets: s3.Bucket
  }
  public readonly distribution: cloudfront.Distribution
  public readonly hostedZone: route53.IHostedZone

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

    const domainName = 'vberkoz.com'
    const subdomain = 'waitlist'
    const fullDomain = `${subdomain}.${domainName}`

    this.hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: domainName
    })

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: fullDomain,
      validation: acm.CertificateValidation.fromDns(this.hostedZone)
    })

    this.distribution = new cloudfront.Distribution(this, 'AssetsDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.buckets.assets),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5)
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5)
        }
      ],
      domainNames: [fullDomain],
      certificate: certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: 'Waitlist Assets CDN'
    })

    new route53.ARecord(this, 'AliasRecord', {
      zone: this.hostedZone,
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution))
    })

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: this.buckets.assets.bucketName,
      description: 'S3 bucket for static assets and exports'
    })

    new cdk.CfnOutput(this, 'AssetsBucketArn', {
      value: this.buckets.assets.bucketArn,
      description: 'S3 bucket ARN'
    })

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID'
    })

    new cdk.CfnOutput(this, 'CloudFrontDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain name'
    })

    new cdk.CfnOutput(this, 'CustomDomainName', {
      value: fullDomain,
      description: 'Custom domain name'
    })

    // Frontend deployment removed temporarily - deploy manually
    // new s3deploy.BucketDeployment(this, 'FrontendDeployment', {
    //   sources: [s3deploy.Source.asset(path.join(__dirname, '../../../frontend/dist'))],
    //   destinationBucket: this.buckets.assets,
    //   distribution: this.distribution,
    //   distributionPaths: ['/*']
    // })
  }
}
