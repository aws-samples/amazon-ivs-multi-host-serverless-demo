import { Ivschat } from "aws-sdk";

import { ResourceTags } from "../../lambda/constants";
import { UserAttributes } from "../types";

const region = process.env.AWS_REGION;

const ivsChatClient = new Ivschat({
  correctClockSkew: true,
  region,
});

function createRoom() {
  return ivsChatClient.createRoom({ tags: ResourceTags }).promise();
}

async function createChatToken(
  roomIdentifier: Ivschat.Types.RoomArn,
  userId: string,
  isHost: string,
  attributes: UserAttributes,
) {
  // If the user is the host, provide additional capabilities
  const capabilities =
    isHost === "true"
      ? ["SEND_MESSAGE", "DELETE_MESSAGE", "DISCONNECT_USER"]
      : ["SEND_MESSAGE"];

  const token = await ivsChatClient
    .createChatToken({
      capabilities,
      roomIdentifier,
      userId,
      attributes: {
        ...attributes,
        isHost,
      },
    })
    .promise();

  return token as Ivschat.Types.CreateChatTokenResponse;
}

function disconnectChatUser(
  roomIdentifier: Ivschat.Types.RoomArn,
  userId: string,
  reason: string,
) {
  return ivsChatClient
    .disconnectUser({
      roomIdentifier,
      userId,
      reason,
    })
    .promise();
}

function deleteRoom(identifier: Ivschat.Types.RoomIdentifier) {
  return ivsChatClient.deleteRoom({ identifier }).promise();
}

export {
  createChatToken,
  createRoom,
  deleteRoom,
  disconnectChatUser,
  ivsChatClient,
};
