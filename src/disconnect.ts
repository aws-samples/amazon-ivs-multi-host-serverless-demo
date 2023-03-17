import { getGroup } from "./sdk/ddb";
import { disconnectParticipant } from "./sdk/realtime";
import { disconnectChatUser } from "./sdk/room";

/**
 * A function that disconnects a user from a group's stage and chat room
 */

async function disconnect(
  groupId: string,
  userId: string,
  participantId: string,
  reason: string,
) {
  let roomId;
  let stageId;

  // Find resources
  try {
    ({ stageId, roomId } = await getGroup(groupId));
  } catch (err) {
    throw new Error(
      `Failed to find associated resources: ${(err as Error).toString()}`,
    );
  }

  // Disconnect from stage
  try {
    await disconnectParticipant(stageId as string, participantId, reason);
  } catch (err) {
    throw new Error(
      `Failed to disconnect from stage: ${(err as Error).toString()}`,
    );
  }

  // Disconnect from chat
  try {
    await disconnectChatUser(roomId as string, userId, reason);
  } catch (err) {
    throw new Error(
      `Failed to disconnect from room: ${(err as Error).toString()}`,
    );
  }

  return {
    status: "success",
  };
}

// eslint-disable-next-line import/prefer-default-export
export { disconnect };
