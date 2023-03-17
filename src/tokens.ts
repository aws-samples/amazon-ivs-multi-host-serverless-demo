import { IVS, Ivschat, IVSRealTime } from "aws-sdk";

import { createStageToken } from "./sdk/realtime";
import { createChatToken } from "./sdk/room";
import { UserAttributes } from "./types";

/**
 * A function that creates a stage and chat room token
 */

async function createTokens(
  roomId: Ivschat.Types.RoomArn,
  stageId: IVSRealTime.Types.StageArn,
  userId: string,
  attributes: UserAttributes,
) {
  let chatTokenData: Ivschat.Types.CreateChatTokenResponse;
  let stageTokenData: IVSRealTime.Types.ParticipantToken;
  const isHost = "true";

  try {
    chatTokenData = await createChatToken(roomId, userId, isHost, attributes);
  } catch (err) {
    throw new Error(
      `Failed to create chat token: ${(err as Error).toString()}`,
    );
  }

  try {
    stageTokenData = await createStageToken(stageId, {
      userId,
      attributes: {
        ...attributes,
        isHost,
      },
    });
  } catch (err) {
    throw new Error(
      `Failed to create stage participant token: ${(err as Error).toString()}`,
    );
  }

  return {
    chatTokenData,
    stageTokenData,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { createTokens };
