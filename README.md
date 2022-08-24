# aws-cdk-ts-s3-cloudfront-website

Deploying static website to AWS S3+Cloudfront using: the manual method from aws 
console, and the CDK typescript method

The website hosted by the Amazon S3 does not support HTTPS endpoints. 
So, the Amazon CloudFront is used as the public entry point with HTTPS to serve 
the website hosted on Amazon S3.

In addition, Amazon CloudFront improves the performance of the static website 
hosted on S3 by making the website files (such as HTML, images, and video) 
available from data centers around the world

![architecture-aws-s3-cloudfront](/images/architecture-aws-s3-cloudfront.png)


## Prerequisite

- [Setup AWS CLI](https://digitalcompanion.gitbook.io/home/setup/aws/cli-and-cloudshell#aws-cli)

- [Setup AWS CDK](https://digitalcompanion.gitbook.io/home/setup/aws/cli-and-cloudshell#cdk)


## Setup

- Clone this repo

- **Note**: the `src` folder contains a very simple web site that we will deploy
  to AWS S3. The `cdk` folder contains the CDK stack code.

- See [aws-cdk-ts-s3-website - Setup](https://github.com/gabepublic/aws-cdk-ts-s3-website#setup) - Bootstrap


## Deploy

### Manual using AWS Console

**Source**: [Getting started with a simple CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)

Also see "References" below for other useful guidelines.

- Sign in to the AWS Management Console and go to the Amazon S3 console at
  [https://console.aws.amazon.com/s3/](https://console.aws.amazon.com/s3/).
  The default S3 console page should be the "Buckets" page showing the list of
  existing buckets.

- Create a new bucket:
  - enter the Bucket name (for example, `example.com`). For more info:
    - For bucket to work with CloudFront, the name must conform to DNS naming 
      requirements.
    - see bucket [Naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)
    - see bucket [Restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BucketRestrictions.html)
  - choose the Region to create the bucket
  - In the "Block Public Access settings for bucket" section, clear the check 
    box for "Block all public access".

You must allow public read access to the bucket and files so that CloudFront URLs can serve content from the bucket. However, you can restrict access to specific content by using the CloudFront private content feature. For more information, see Serving private content with signed URLs and signed cookies.

Select the check box for I acknowledge that the current settings might result in this bucket and the objects within becoming public..

Leave all other settings at their defaults, and then choose Create bucket.

(Optional) If you don’t have your own website content, or if you just want to experiment with CloudFront before uploading your own content, use the following link to download a simple hello world webpage: hello-world-html.zip.

In the Buckets section, choose your new bucket, and then choose Upload.

Use the Upload page to add your content to the S3 bucket. If you downloaded the simple hello world webpage, add the index.html file and the css folder (with the style.css file inside it).

Choose Additional upload options to expand the section.

In the Access control list (ACL) section, select the check box for Read next to Everyone (public access) in the Objects column.

Select the check box for I understand the effects of these changes on the specified objects.

At the bottom of the page, choose Upload.

After the upload is complete, you can navigate to the item by using its URL. For example:


  

- Open the CloudFront console at https://console.aws.amazon.com/cloudfront/v3/home.

- Click Create Distribution

- On the Create Distribution page, in the Origin section, 
  - click the Origin domain textbox and the list of S3 buckets will appear. 
    Select the S3 website endpoint, for example, 
    `gt-simple-website01.s3.us-west-2.amazonaws.com`. The Name will be populated.
    **NOTE**: this S3 bucket should be made “private”, meaning that it will be 
    inaccessible directly from the internet. The "Block all public access" 
    checkbox will be checked. The CloudFront will act as the entrypoint to the 
    files within the bucket.

Instead, we’ll use CloudFront as the entrypoint to the files within the bucket
  - For the other settings, accept the default values.

- For the settings in the "Default Cache Behavior" section, accept the default 
  values. For more information about cache behavior options, see 
  [Cache behavior settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCacheBehavior).

- For the settings under the "Settings" section, accept the default values.
  For more information about distribution options, see 
  [Distribution settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesGeneral).

- At the bottom of the page, choose Create Distribution.

- After CloudFront creates your distribution, the value of the Status column for
  your distribution changes from In Progress to Deployed. This typically takes
  a few minutes.

- Record the domain name that CloudFront assigns to your distribution, which 
  appears in the list of distributions. (It also appears on the General tab for
  a selected distribution.) It looks similar to the following: 
  `d111111abcdef8.cloudfront.net`.

- Open browser and go to `https://d111111abcdef8.cloudfront.net/index.html`.
  NOTE: it should work for both: HTTP and HTTPS


### Automate using CDK method

Source: [Deploying a static website using S3 and CloudFront](https://aws-cdk.com/deploying-a-static-website-using-s3-and-cloudfront/)

- **Assumptions**:
  - AWS CLI setup & configured
  - AWS CDK setup & configured

- **CDK deployment application** - Pre-built and included in this repo. The 
  step-by-step instructions are provided below, as folows:
  - Create CDK application template
```
$ cd <project-folder>/aws-cdk-ts-s3-cloudfront-website
$ mkdir cdk && cd cdk
$ cdk init app --language typescript
```
  - The CDK deployment application is the Infrastructure as Code, and 
    it consists of codes (i.e., typescript) utilizing the AWS CDK libraries 
    to instruct the AWS services in setting up and configuring the AWS resources.
  - For this example, the codes have been added to the following files,
    after initial template creation: `./cdk/bin/cdk.ts` and 
    `./cdk/lib/cdk-stack.ts`
  - The codes included with this repo should work without further modification.

- Build the CDK app
```
$ cd <project-folder>/aws-cdk-ts-s3-cloudfront-website/cdk
$ npm install
```

- Synthesize an AWS CloudFormation template
```
$ cd <project-folder>/aws-cdk-ts-s3-cloudfront-website/cdk
$ cdk synth
Resources:
  awscdktss3cloudfrontwebsitebucket0B2CCB5D:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      Tags:
        - Key: aws-cdk:auto-delete-objects
          Value: "true"
        - Key: aws-cdk:cr-owned:372a2262
          Value: "true"
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ts-s3-cloudfront-website-bucket/Resource
  awscdktss3cloudfrontwebsitebucketPolicyC42DD1EA:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: awscdktss3cloudfrontwebsitebucket0B2CCB5D
      PolicyDocument:
        Statement:
          - Action:
              - s3:DeleteObject*
              - s3:GetBucket*
              - s3:List*
            Effect: Allow
            Principal:
              AWS:
                Fn::GetAtt:
                  - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
                  - Arn
            Resource:
              - Fn::GetAtt:
                  - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                        - Arn
                    - /*
          - Action:
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
            Effect: Allow
            Principal:
              CanonicalUser:
                Fn::GetAtt:
                  - awscdktss3cloudfrontwebsiteoriginaccessidentityAB0A9323
                  - S3CanonicalUserId
            Resource:
              - Fn::GetAtt:
                  - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                        - Arn
                    - /*
          - Action: s3:GetObject
            Effect: Allow
            Principal:
              CanonicalUser:
                Fn::GetAtt:
                  - awscdktss3cloudfrontwebsiteoriginaccessidentityAB0A9323
                  - S3CanonicalUserId
            Resource:
              Fn::Join:
                - ""
                - - Fn::GetAtt:
                      - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                      - Arn
                  - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ts-s3-cloudfront-website-bucket/Policy/Resource
  awscdktss3cloudfrontwebsitebucketAutoDeleteObjectsCustomResourceC2E89275:
    Type: Custom::S3AutoDeleteObjects
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - CustomS3AutoDeleteObjectsCustomResourceProviderHandler9D90184F
          - Arn
      BucketName:
        Ref: awscdktss3cloudfrontwebsitebucket0B2CCB5D
    DependsOn:
      - awscdktss3cloudfrontwebsitebucketPolicyC42DD1EA
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ts-s3-cloudfront-website-bucket/AutoDeleteObjectsCustomResource/Default
  CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
      ManagedPolicyArns:
        - Fn::Sub: arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Metadata:
      aws:cdk:path: CdkStack/Custom::S3AutoDeleteObjectsCustomResourceProvider/Role
  CustomS3AutoDeleteObjectsCustomResourceProviderHandler9D90184F:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket:
          Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
        S3Key: 990410bab4a39b07c4495c3b8fae2f3f8847daabc9e3fc1debf3fa050c25e302.zip
      Timeout: 900
      MemorySize: 128
      Handler: __entrypoint__.handler
      Role:
        Fn::GetAtt:
          - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
          - Arn
      Runtime: nodejs14.x
      Description:
        Fn::Join:
          - ""
          - - "Lambda function for auto-deleting objects in "
            - Ref: awscdktss3cloudfrontwebsitebucket0B2CCB5D
            - " S3 bucket."
    DependsOn:
      - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
    Metadata:
      aws:cdk:path: CdkStack/Custom::S3AutoDeleteObjectsCustomResourceProvider/Handler
      aws:asset:path: asset.990410bab4a39b07c4495c3b8fae2f3f8847daabc9e3fc1debf3fa050c25e302
      aws:asset:property: Code
  awscdktys3cloudfrontwebsitebucketdeploymentAwsCliLayerA115208B:
    Type: AWS::Lambda::LayerVersion
    Properties:
      Content:
        S3Bucket:
          Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
        S3Key: b7f327b4415410f319943b754edb274645a9d6850369ae4da9ba209858099210.zip
      Description: /opt/awscli/aws
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ty-s3-cloudfront-website-bucketdeployment/AwsCliLayer/Resource
      aws:asset:path: asset.b7f327b4415410f319943b754edb274645a9d6850369ae4da9ba209858099210.zip
      aws:asset:is-bundled: false
      aws:asset:property: Content
  awscdktys3cloudfrontwebsitebucketdeploymentCustomResourceA8C5A8D2:
    Type: Custom::CDKBucketDeployment
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536
          - Arn
      SourceBucketNames:
        - Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
      SourceObjectKeys:
        - a45af0f103767cdfa62f52478cd2e33a0c44babd71e5a1e4d8068557f006ba09.zip
      DestinationBucketName:
        Ref: awscdktss3cloudfrontwebsitebucket0B2CCB5D
      Prune: true
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ty-s3-cloudfront-website-bucketdeployment/CustomResource/Default
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Metadata:
      aws:cdk:path: CdkStack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/Resource
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
            Effect: Allow
            Resource:
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - ":s3:::"
                    - Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
                    - /*
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - ":s3:::"
                    - Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
          - Action:
              - s3:Abort*
              - s3:DeleteObject*
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
              - s3:PutObject
              - s3:PutObjectLegalHold
              - s3:PutObjectRetention
              - s3:PutObjectTagging
              - s3:PutObjectVersionTagging
            Effect: Allow
            Resource:
              - Fn::GetAtt:
                  - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                        - Arn
                    - /*
        Version: "2012-10-17"
      PolicyName: CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF
      Roles:
        - Ref: CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
    Metadata:
      aws:cdk:path: CdkStack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket:
          Fn::Sub: cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}
        S3Key: f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da.zip
      Role:
        Fn::GetAtt:
          - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
          - Arn
      Handler: index.handler
      Layers:
        - Ref: awscdktys3cloudfrontwebsitebucketdeploymentAwsCliLayerA115208B
      Runtime: python3.7
      Timeout: 900
    DependsOn:
      - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF
      - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
    Metadata:
      aws:cdk:path: CdkStack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/Resource
      aws:asset:path: asset.f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da
      aws:asset:is-bundled: false
      aws:asset:property: Code
  awscdktss3cloudfrontwebsiteoriginaccessidentityAB0A9323:
    Type: AWS::CloudFront::CloudFrontOriginAccessIdentity
    Properties:
      CloudFrontOriginAccessIdentityConfig:
        Comment: Allows CloudFront to reach the bucket
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ts-s3-cloudfront-website-originaccessidentity/Resource
  awscdktss3cloudfrontwebsitedistributionB2A403A3:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        DefaultCacheBehavior:
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
          Compress: true
          TargetOriginId: CdkStackawscdktss3cloudfrontwebsitedistributionOrigin13B5AE2DC
          ViewerProtocolPolicy: allow-all
        DefaultRootObject: index.html
        Enabled: true
        HttpVersion: http2
        IPV6Enabled: true
        Origins:
          - DomainName:
              Fn::GetAtt:
                - awscdktss3cloudfrontwebsitebucket0B2CCB5D
                - RegionalDomainName
            Id: CdkStackawscdktss3cloudfrontwebsitedistributionOrigin13B5AE2DC
            S3OriginConfig:
              OriginAccessIdentity:
                Fn::Join:
                  - ""
                  - - origin-access-identity/cloudfront/
                    - Ref: awscdktss3cloudfrontwebsiteoriginaccessidentityAB0A9323
    Metadata:
      aws:cdk:path: CdkStack/aws-cdk-ts-s3-cloudfront-website-distribution/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/21RXWsCMRD8Lb7HbVVa6KOeCIVCRaGvR0zWYzWXlGyiSLj/3tzFjxb6NLOTIZmdTGH6Bs8jeeax0sexoR2kbZDqKLJUJ55BWkR1xCCqvb2yAmtnSF0e8nUuw0IydoJnddL4bdylRRugHC3vgpDMGBjmPXTCyHanJaR844e8oP9Cz+Ss2JJtDAZnV9Gq0Ct3kq033gmSLaSNM9jLAz4iFtYJZVzUe+9ymvTpqSE7VwqZ33XOQ2HwVr1n1Xv+dSyJg6ddvAX4PXedqCIH126QXfSqRLnzP0dr706k0Yth/dx5fqq5llCbvoA6f4EyBPMzV4aGToZ8zmoqK1unEQ78dJq8wuQFJqMDE419zElbhE3BH7u3GUbjAQAA
    Metadata:
      aws:cdk:path: CdkStack/CDKMetadata/Default
    Condition: CDKMetadataAvailable
Conditions:
  CDKMetadataAvailable:
    Fn::Or:
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - af-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-northeast-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-northeast-2
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-southeast-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-southeast-2
          - Fn::Equals:
              - Ref: AWS::Region
              - ca-central-1
          - Fn::Equals:
              - Ref: AWS::Region
              - cn-north-1
          - Fn::Equals:
              - Ref: AWS::Region
              - cn-northwest-1
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-central-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-north-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-2
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-3
          - Fn::Equals:
              - Ref: AWS::Region
              - me-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - sa-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-east-2
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - us-west-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-west-2
Parameters:
  BootstrapVersion:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /cdk-bootstrap/hnb659fds/version
    Description: Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]
Rules:
  CheckBootstrapVersion:
    Assertions:
      - Assert:
          Fn::Not:
            - Fn::Contains:
                - - "1"
                  - "2"
                  - "3"
                  - "4"
                  - "5"
                - Ref: BootstrapVersion
        AssertDescription: CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.
$
```

- Deploy
```
$ cd <project-folder>/aws-cdk-ts-s3-cloudfront-website/cdk
$ cdk deploy

✨  Synthesis time: 6.73s

This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬────────────────────────────────┬────────┬────────────────────────────────┬────────────────────────────────┬───────────┐
│   │ Resource                       │ Effect │ Action                         │ Principal                      │ Condition │
├───┼────────────────────────────────┼────────┼────────────────────────────────┼────────────────────────────────┼───────────┤
│ + │ ${Custom::CDKBucketDeployment8 │ Allow  │ sts:AssumeRole                 │ Service:lambda.amazonaws.com   │           │
│   │ 693BB64968944B69AAFB0CC9EB8756 │        │                                │                                │           │
│   │ C/ServiceRole.Arn}             │        │                                │                                │           │
├───┼────────────────────────────────┼────────┼────────────────────────────────┼────────────────────────────────┼───────────┤
│ + │ ${Custom::S3AutoDeleteObjectsC │ Allow  │ sts:AssumeRole                 │ Service:lambda.amazonaws.com   │           │
│   │ ustomResourceProvider/Role.Arn │        │                                │                                │           │
│   │ }                              │        │                                │                                │           │
├───┼────────────────────────────────┼────────┼────────────────────────────────┼────────────────────────────────┼───────────┤
│ + │ ${aws-cdk-ts-s3-cloudfront-web │ Allow  │ s3:DeleteObject*               │ AWS:${Custom::S3AutoDeleteObje │           │
│   │ site-bucket.Arn}               │        │ s3:GetBucket*                  │ ctsCustomResourceProvider/Role │           │
│   │ ${aws-cdk-ts-s3-cloudfront-web │        │ s3:List*                       │ .Arn}                          │           │
│   │ site-bucket.Arn}/*             │        │                                │                                │           │
│ + │ ${aws-cdk-ts-s3-cloudfront-web │ Allow  │ s3:GetBucket*                  │ CanonicalUser:${aws-cdk-ts-s3- │           │
│   │ site-bucket.Arn}               │        │ s3:GetObject*                  │ cloudfront-website-originacces │           │
│   │ ${aws-cdk-ts-s3-cloudfront-web │        │ s3:List*                       │ sidentity.S3CanonicalUserId}   │           │
│   │ site-bucket.Arn}/*             │        │                                │                                │           │
│ + │ ${aws-cdk-ts-s3-cloudfront-web │ Allow  │ s3:Abort*                      │ AWS:${Custom::CDKBucketDeploym │           │
│   │ site-bucket.Arn}               │        │ s3:DeleteObject*               │ ent8693BB64968944B69AAFB0CC9EB │           │
│   │ ${aws-cdk-ts-s3-cloudfront-web │        │ s3:GetBucket*                  │ 8756C/ServiceRole}             │           │
│   │ site-bucket.Arn}/*             │        │ s3:GetObject*                  │                                │           │
│   │                                │        │ s3:List*                       │                                │           │
│   │                                │        │ s3:PutObject                   │                                │           │
│   │                                │        │ s3:PutObjectLegalHold          │                                │           │
│   │                                │        │ s3:PutObjectRetention          │                                │           │
│   │                                │        │ s3:PutObjectTagging            │                                │           │
│   │                                │        │ s3:PutObjectVersionTagging     │                                │           │
├───┼────────────────────────────────┼────────┼────────────────────────────────┼────────────────────────────────┼───────────┤
│ + │ ${aws-cdk-ts-s3-cloudfront-web │ Allow  │ s3:GetObject                   │ CanonicalUser:${aws-cdk-ts-s3- │           │
│   │ site-bucket.Arn}/*             │        │                                │ cloudfront-website-originacces │           │
│   │                                │        │                                │ sidentity.S3CanonicalUserId}   │           │
├───┼────────────────────────────────┼────────┼────────────────────────────────┼────────────────────────────────┼───────────┤
│ + │ arn:${AWS::Partition}:s3:::{"F │ Allow  │ s3:GetBucket*                  │ AWS:${Custom::CDKBucketDeploym │           │
│   │ n::Sub":"cdk-hnb659fds-assets- │        │ s3:GetObject*                  │ ent8693BB64968944B69AAFB0CC9EB │           │
│   │ ${AWS::AccountId}-${AWS::Regio │        │ s3:List*                       │ 8756C/ServiceRole}             │           │
│   │ n}"}                           │        │                                │                                │           │
│   │ arn:${AWS::Partition}:s3:::{"F │        │                                │                                │           │
│   │ n::Sub":"cdk-hnb659fds-assets- │        │                                │                                │           │
│   │ ${AWS::AccountId}-${AWS::Regio │        │                                │                                │           │
│   │ n}"}/*                         │        │                                │                                │           │
└───┴────────────────────────────────┴────────┴────────────────────────────────┴────────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬───────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────┐
│   │ Resource                                                  │ Managed Policy ARN                                        │
├───┼───────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ + │ ${Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8 │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLam │
│   │ 756C/ServiceRole}                                         │ bdaBasicExecutionRole                                     │
├───┼───────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ + │ ${Custom::S3AutoDeleteObjectsCustomResourceProvider/Role} │ {"Fn::Sub":"arn:${AWS::Partition}:iam::aws:policy/service │
│   │                                                           │ -role/AWSLambdaBasicExecutionRole"}                       │
└───┴───────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)? y
CdkStack: deploying...
[0%] start: Publishing 990410bab4a39b07c4495c3b8fae2f3f8847daabc9e3fc1debf3fa050c25e302:current_account-current_region
[0%] start: Publishing b7f327b4415410f319943b754edb274645a9d6850369ae4da9ba209858099210:current_account-current_region
[0%] start: Publishing f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da:current_account-current_region
[0%] start: Publishing a45af0f103767cdfa62f52478cd2e33a0c44babd71e5a1e4d8068557f006ba09:current_account-current_region
[0%] start: Publishing 032b88dda604fc8f0a305a2226f61fc30e0209130eac8313b9be79657c3fe140:current_account-current_region
[20%] success: Published f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da:current_account-current_region
[40%] success: Published a45af0f103767cdfa62f52478cd2e33a0c44babd71e5a1e4d8068557f006ba09:current_account-current_region
[60%] success: Published 990410bab4a39b07c4495c3b8fae2f3f8847daabc9e3fc1debf3fa050c25e302:current_account-current_region
[80%] success: Published b7f327b4415410f319943b754edb274645a9d6850369ae4da9ba209858099210:current_account-current_region
[100%] success: Published 032b88dda604fc8f0a305a2226f61fc30e0209130eac8313b9be79657c3fe140:current_account-current_region
CdkStack: creating CloudFormation changeset...

 ✅  CdkStack

✨  Deployment time: 231.21s

Stack ARN:
arn:aws:cloudformation:us-west-2:349327579537:stack/CdkStack/5da65b60-2351-11ed-a31c-0637d7f75981

✨  Total time: 237.94s
```


## TEST

- Check AWS S3 console, a new bucket 
  `cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6` has been
  created  

- Go to AWS CloudFront console, check a new CloudFront Distribution has been 
  created, for example:
  - ID: E2QBYKT1R879A0
  - Distribution domain Name: dca4bfgkqco1l.cloudfront.net
  - Price class: Use all edge locations (best performance)
  - Supported HTTP versions: HTTP/2, HTTP/1.1, HTTP/1.0
  - Default root object: index.html
  - Origin name: CdkStackawscdktss3cloudfrontwebsitedistribution0
  - Origin domain: cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6.s3.us-west-2.amazonaws.com
  - Origin type: S3
  - Origin access: origin-access-identity/cloudfront/E27E075WH2MYBD
  - Behavior - Cache Policy: Managed-CachingOptimized 
  - Error pages: none

- Open browser and the "Welcome" page is displayed when go to the following: 
  - `https://dca4bfgkqco1l.cloudfront.net`

- Open browser and the error page, showing "Ooop!!" was not setup

- On the S3 console, the following is shown:
  - Objects tab: four files
  - Properties tab > Static website hosting:
    - Static website hosting: Disabled
    - Hosting type: Bucket hosting
    - Bucket website endpoint: none
  - Permissions tab: 
    - Permissions overview > Access: Objects can be public
    - Block public access (bucket settings) > Block all public access: Off
    - Bucket policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::349327579537:role/CdkStack-CustomS3AutoDeleteObjectsCustomResourcePr-1T2P22ECUHKM7"
            },
            "Action": [
                "s3:DeleteObject*",
                "s3:GetBucket*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6",
                "arn:aws:s3:::cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6/*"
            ]
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E27E075WH2MYBD"
            },
            "Action": [
                "s3:GetBucket*",
                "s3:GetObject*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6",
                "arn:aws:s3:::cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6/*"
            ]
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E27E075WH2MYBD"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cdkstack-awscdktss3cloudfrontwebsitebucket0b2ccb5-36xlkvjqtbo6/*"
        }
    ]
}
```

## CLEANUP

- Cleanup all artifacts created by CDK
```
$ cd <project-folder>/aws-cdk-ts-s3-cloudfront-website/cdk
$ cdk destroy
```

- Additional cleanup not done by the the `cdk destroy`:
  - CloudWatch Log group; go to AWS Console "CloudWatch > Logs > Log groups"
    and delete two log groups created by `cdk deploy` but not deleted:
    - `/aws/lambda/<stack-name>-CustomCDKBucketDeployment<unique-id>`
    - `/aws/lambda/<stack-name>-CustomS3AutoDeleteObjectsCustomResourcePr-<unique-id>`


## References

- [Speeding up your website with Amazon CloudFront](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-cloudfront-walkthrough.html)
