import { IVS, Ivschat, IVSRealTime } from "aws-sdk";

import { deleteGroup, getGroup } from "./sdk/ddb";
import { deleteStage } from "./sdk/realtime";
import { deleteRoom } from "./sdk/room";
import { deleteChannel, stopStream } from "./sdk/video";

/**
 * A function that destroys a group and it's related resources.
 */

async function deleteGroupAndResources(groupId: string) {
  let channelId;
  let stageId;
  let roomId;

  // Find resources
  try {
    ({ channelId, stageId, roomId } = await getGroup(groupId));
  } catch (err) {
    throw new Error(
      `Failed to find associated resources: ${(err as Error).toString()}`,
    );
  }

  // Deleted db entry
  try {
    await deleteGroup(groupId);
  } catch (err) {
    throw new Error(
      `Failed to delete stage table entry: ${(err as Error).toString()}`,
    );
  }

  // Stop streaming
  try {
    await stopStream(channelId as IVS.Types.ChannelArn);
  } catch (err) {
    // Silently report ChannelNotBroadcasting errors.
    if (err instanceof Error) {
      if (err.name === "ChannelNotBroadcasting") {
        console.log((err as Error).toString());
      } else {
        throw new Error(`Failed to stop stream: ${(err as Error).toString()}`);
      }
    } else {
      throw new Error(`Failed to stop stream: ${(err as Error).toString()}`);
    }
  }

  // Delete channel
  try {
    await deleteChannel(channelId as IVS.Types.ChannelArn);
  } catch (err) {
    throw new Error(`Failed to delete channel: ${(err as Error).toString()}`);
  }

  // Delete stage
  try {
    await deleteStage(stageId as IVSRealTime.Types.StageArn);
  } catch (err) {
    throw new Error(`Failed to delete stage: ${(err as Error).toString()}`);
  }

  // Delete room
  try {
    await deleteRoom(roomId as Ivschat.Types.RoomIdentifier);
  } catch (err) {
    throw new Error(`Failed to delete room: ${(err as Error).toString()}`);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { deleteGroupAndResources };
