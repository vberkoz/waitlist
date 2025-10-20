import * as cdk from 'aws-cdk-lib'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool
  public readonly userPoolClient: cognito.UserPoolClient

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.userPool = new cognito.UserPool(this, 'WaitlistUserPool', {
      userPoolName: 'waitlist-user-pool',
      signInAliases: {
        email: true
      },
      selfSignUpEnabled: false, // Admin creates users
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY // For dev/testing
    })

    this.userPoolClient = new cognito.UserPoolClient(this, 'WaitlistUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'waitlist-client',
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      generateSecret: false, // For frontend apps
      preventUserExistenceErrors: true
    })

    // Create default admin user
    new cognito.CfnUserPoolUser(this, 'AdminUser', {
      userPoolId: this.userPool.userPoolId,
      username: 'admin@waitlist.com',
      userAttributes: [
        {
          name: 'email',
          value: 'admin@waitlist.com'
        },
        {
          name: 'email_verified',
          value: 'true'
        }
      ],
      messageAction: 'SUPPRESS'
    })

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID'
    })

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID'
    })
  }
}