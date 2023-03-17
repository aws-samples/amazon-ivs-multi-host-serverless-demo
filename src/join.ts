import { IVS, Ivschat, IVSRealTime } from "aws-sdk";

import { getGroup } from "./sdk/ddb";
import { createTokens } from "./tokens";
import { RoomResponse, StageResponse, UserAttributes } from "./types";

/**
 * A function that creates creates a stage token and chat token for the
 * stage and room associated with the provided `groupId`
 */

async function join(
  groupId: string,
  userId: string,
  attributes: UserAttributes,
) {
  let roomResponse: RoomResponse;
  let stageResponse: StageResponse;

  // Find resources
  try {
    const { stageId, roomId } = await getGroup(groupId);
    stageResponse = {
      id: stageId as IVSRealTime.Types.StageArn,
      token: "" as IVSRealTime.Types.ParticipantToken,
    };
    roomResponse = {
      id: roomId as Ivschat.Types.RoomIdentifier,
      token: "" as Ivschat.Types.CreateChatTokenResponse,
    };
  } catch (err) {
    throw new Error(
      `Failed to find associated resources: ${(err as Error).toString()}`,
    );
  }

  // Create tokens
  try {
    const { chatTokenData, stageTokenData } = await createTokens(
      roomResponse.id as string,
      stageResponse.id as string,
      userId as string,
      attributes as UserAttributes,
    );
    roomResponse.token = chatTokenData;
    stageResponse.token = stageTokenData;
  } catch (err) {
    throw new Error(`Failed to create tokens: ${(err as Error).toString()}`);
  }

  return {
    chat: roomResponse,
    stage: stageResponse,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { join };
