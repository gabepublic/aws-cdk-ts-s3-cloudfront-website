import * as cdk from 'aws-cdk-lib';
//import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";

const s3 = cdk.aws_s3;
const s3deploy = cdk.aws_s3_deployment;
const cf = cdk.aws_cloudfront;
const origin = cdk.aws_cloudfront_origins;

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // ** Create the S3 bucket to store the website file
    // Note: Do not use the websiteIndexDocument or websiteErrorDocument props of 
    // the Bucket construct if you pan to use CloudFront to front the website.
    // Passing these will cause the Bucket to be automatically configured as 
    // “website enabled”, which is not intended for CloudFront setup.
    //       accessControl: s3.BucketAccessControl.PUBLIC_READ,
    const bucket = new s3.Bucket(this, 'aws-cdk-ts-s3-cloudfront-website-bucket', {
      accessControl: s3.BucketAccessControl.PRIVATE,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,      
    });

    // ** Deploying the website to the S3 bucket
    // After deployment, if you try to access the S3 bucket directly using the 
    // auto-generated URL (e.g., https://<bucket-name>.s3-us-west-2.amazonaws.com/ )
    // from a browser, you will get AccessDenied error, because of the bucket
    // accessControl policy set above
    const deployment = new s3deploy.BucketDeployment(this, 'aws-cdk-ty-s3-cloudfront-website-bucketdeployment', {
      destinationBucket: bucket,
      sources: [s3deploy.Source.asset(path.resolve(__dirname, '..', '..', 'src'))]
    });

    // ** Create CloudFront distribution to serve as an HTTPS entry point to
    // the website 
    const originAccessIdentity = new cf.OriginAccessIdentity(this, 'aws-cdk-ts-s3-cloudfront-website-originaccessidentity');
    bucket.grantRead(originAccessIdentity);
    const dist = new cf.Distribution(this, 'aws-cdk-ts-s3-cloudfront-website-distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origin.S3Origin(bucket, {originAccessIdentity}),
      },
    });
    
    // Create a CDK Output which details the URL of the S3 bucket.
    new cdk.CfnOutput(this, "aws-cdk-ts-s3-cloudfront-website-URL", {
      description: "The CloudFront URL:",
      value: dist.distributionDomainName,
    });
    
  }
}
