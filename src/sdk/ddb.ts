import { DynamoDB, IVS, Ivschat, IVSRealTime } from "aws-sdk";

import { MultiHostGroup, UserAttributes } from "../types";

const region = process.env.AWS_REGION;
const { TABLE_NAME } = process.env;

const ddbClient = new DynamoDB.DocumentClient({
  correctClockSkew: true,
  region,
});

async function scanGroups() {
  let tableData: DynamoDB.Types.ScanOutput;

  try {
    tableData = await ddbClient
      .scan({ TableName: TABLE_NAME as string, Select: "ALL_ATTRIBUTES" })
      .promise();
  } catch (err) {
    throw new Error(`Failed to get stage data: ${(err as Error).toString()}`);
  }

  return tableData.Items as MultiHostGroup[];
}

async function getGroup(groupId: string) {
  let tableData: DynamoDB.Types.GetItemOutput;

  try {
    tableData = await ddbClient
      .get({
        TableName: TABLE_NAME as string,
        Key: { groupId },
      })
      .promise();
  } catch (err) {
    throw new Error(`Failed to get stage data: ${(err as Error).toString()}`);
  }

  return tableData.Item as MultiHostGroup;
}

async function putGroup(
  groupId: string,
  stageId: IVSRealTime.Types.StageArn,
  channelId: IVS.Types.ChannelArn,
  roomId: Ivschat.Types.RoomArn,
  hostAttributes: UserAttributes,
) {
  // Write info to DynamoDB
  try {
    await ddbClient
      .put({
        TableName: TABLE_NAME as string,
        Item: {
          groupId,
          stageId,
          channelId,
          roomId,
          stageAttributes: hostAttributes,
        },
      })
      .promise();
  } catch (err) {
    throw new Error(
      `Failed to update table ${TABLE_NAME}: ${(err as Error).toString()}`,
    );
  }
}

function deleteGroup(groupId: string) {
  return ddbClient
    .delete({
      TableName: TABLE_NAME as string,
      Key: { groupId },
    })
    .promise();
}

export { ddbClient, deleteGroup, getGroup, putGroup, scanGroups };
