import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { DDBTableName } from "./constants";

function getPolicy(): PolicyStatement {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["ivs:*", "ivschat:*"],
    resources: ["*"],
  });
}

class AmazonIVSMultiHostStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const initialPolicy = [getPolicy()];
    const runtime = Runtime.NODEJS_18_X;
    const environment = { TABLE_NAME: DDBTableName };
    const timeout = Duration.minutes(1);

    const stagesTable = new Table(this, DDBTableName, {
      tableName: DDBTableName,
      partitionKey: {
        name: "groupId",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const createFunction = new NodejsFunction(
      this,
      "AmazonIVSMultiHostDemoCreateFunction",
      {
        entry: "lambda/createHandler.ts",
        handler: "createHandler",
        initialPolicy,
        runtime,
        environment,
        timeout,
      },
    );

    const deleteFunction = new NodejsFunction(
      this,
      "AmazonIVSMultiHostDemoDeleteFunction",
      {
        entry: "lambda/deleteHandler.ts",
        handler: "deleteHandler",
        initialPolicy,
        runtime,
        environment,
        timeout,
      },
    );

    const listFunction = new NodejsFunction(
      this,
      "AmazonIVSMultiHostDemoListFunction",
      {
        entry: "lambda/listHandler.ts",
        handler: "listHandler",
        initialPolicy,
        runtime,
        environment,
        timeout,
      },
    );

    const stageJoinFunction = new NodejsFunction(
      this,
      "AmazonIVSMultiHostDemoJoinFunction",
      {
        entry: "lambda/stageJoinHandler.ts",
        handler: "stageJoinHandler",
        initialPolicy,
        runtime,
        environment,
        timeout,
      },
    );

    const stageDisconnectFunction = new NodejsFunction(
      this,
      "AmazonIVSMultiHostDemoDisconnectFunction",
      {
        entry: "lambda/stageDisconnectHandler.ts",
        handler: "stageDisconnectHandler",
        initialPolicy,
        runtime,
        environment,
        timeout,
      },
    );

    stagesTable.grantWriteData(createFunction);
    stagesTable.grantReadWriteData(deleteFunction);
    stagesTable.grantReadData(listFunction);
    stagesTable.grantReadData(stageJoinFunction);
    stagesTable.grantReadData(stageDisconnectFunction);

    const api = new RestApi(this, "AmazonIVSMultiHostDemoApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["POST", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const createPath = api.root.addResource("create");
    createPath.addMethod("POST", new LambdaIntegration(createFunction));

    const deletePath = api.root.addResource("delete");
    deletePath.addMethod("DELETE", new LambdaIntegration(deleteFunction));

    const listPath = api.root.addResource("list");
    listPath.addMethod("POST", new LambdaIntegration(listFunction));

    const disconnectPath = api.root.addResource("disconnect");
    disconnectPath.addMethod(
      "POST",
      new LambdaIntegration(stageDisconnectFunction),
    );

    const joinPath = api.root.addResource("join");
    joinPath.addMethod("POST", new LambdaIntegration(stageJoinFunction));
  }
}

export default AmazonIVSMultiHostStack;
