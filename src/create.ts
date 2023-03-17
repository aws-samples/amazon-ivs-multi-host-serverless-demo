import { IVS, Ivschat, Ivsrealtime } from "aws-sdk";

import { putGroup } from "./sdk/ddb";
import { createStage } from "./sdk/realtime";
import { createRoom } from "./sdk/room";
import { createChannel } from "./sdk/video";
import { createTokens } from "./tokens";
import {
  ChannelResponse,
  RoomResponse,
  StageResponse,
  UserAttributes,
} from "./types";

/**
 * A function that creates a group with the provided `groupId` and the following
 * associated resources: Amazon IVS channel, chat room, stage.
 * Returns a stage token and chat token
 */

async function create(
  groupIdParam: string,
  userId: string,
  attributes: UserAttributes,
) {
  let groupId: string;
  let channelResponse: ChannelResponse;
  let roomResponse: RoomResponse;
  let stageResponse: StageResponse;

  // Create channel
  try {
    const { channel, streamKey } = await createChannel();
    channelResponse = {
      id: channel?.arn as IVS.Types.ChannelArn,
      playbackUrl: channel?.playbackUrl as IVS.Types.PlaybackURL,
      ingestEndpoint: channel?.ingestEndpoint as IVS.Types.IngestEndpoint,
      streamKey: streamKey?.value as IVS.Types.StreamKeyValue,
    };
  } catch (err) {
    throw new Error(`Failed to create channel: ${(err as Error).toString()}`);
  }

  // Create room
  try {
    const room = await createRoom();
    roomResponse = {
      id: room.arn as Ivschat.Types.RoomIdentifier,
      token: "" as Ivschat.Types.CreateChatTokenResponse,
    };
  } catch (err) {
    throw new Error(`Failed to create chat room: ${(err as Error).toString()}`);
  }

  // Create stage
  try {
    const stage = await createStage();
    stageResponse = {
      id: stage.arn as Ivsrealtime.Types.StageArn,
      token: "" as Ivsrealtime.Types.ParticipantToken,
    };
  } catch (err) {
    throw new Error(`Failed to create stage: ${(err as Error).toString()}`);
  }

  // Write to db
  try {
    groupId = groupIdParam || stageResponse.id;
    await putGroup(
      groupId,
      stageResponse.id,
      channelResponse.id,
      roomResponse.id,
      attributes,
    );
  } catch (err) {
    throw new Error(`Failed to write details: ${(err as Error).toString()}`);
  }

  // Create tokens
  try {
    const { chatTokenData, stageTokenData } = await createTokens(
      roomResponse.id,
      stageResponse.id,
      userId,
      attributes,
    );
    roomResponse.token = chatTokenData;
    stageResponse.token = stageTokenData;
  } catch (err) {
    throw new Error(`Failed to create tokens: ${(err as Error).toString()}`);
  }

  return {
    groupId,
    channel: channelResponse,
    stage: stageResponse,
    chat: roomResponse,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { create };
