import { IVSRealTime } from "aws-sdk";

import { ResourceTags } from "../../lambda/constants";

const region = process.env.AWS_REGION;

const ivsRealtimeClient = new IVSRealTime({
  correctClockSkew: true,
  region,
});

/**
 * IVS stages
 */
async function createStage() {
  const { stage } = await ivsRealtimeClient
    .createStage({ tags: ResourceTags })
    .promise();
  return stage as Required<IVSRealTime.Types.Stage>;
}

async function createStageToken(
  stageArn: IVSRealTime.Types.StageArn,
  participant: IVSRealTime.Types.ParticipantTokenConfiguration,
) {
  const { participantToken } = await ivsRealtimeClient
    .createParticipantToken({ stageArn, ...participant })
    .promise();
  return participantToken as Required<IVSRealTime.Types.ParticipantToken>;
}

function deleteStage(arn: IVSRealTime.Types.StageArn) {
  return ivsRealtimeClient.deleteStage({ arn }).promise();
}

function disconnectParticipant(
  stageArn: IVSRealTime.Types.StageArn,
  participantId: IVSRealTime.Types.ParticipantTokenUserId,
  reason: IVSRealTime.Types.DisconnectParticipantReason,
) {
  return ivsRealtimeClient
    .disconnectParticipant({
      stageArn,
      participantId,
      reason,
    })
    .promise();
}

export { createStage, createStageToken, deleteStage, disconnectParticipant };
