import { IVS } from "aws-sdk";

import { ResourceTags } from "../../lambda/constants";

const region = process.env.AWS_REGION;

const ivsVideoClient = new IVS({
  correctClockSkew: true,
  region,
});

/**
 * IVS channels
 */
function createChannel() {
  return ivsVideoClient.createChannel({ tags: ResourceTags }).promise();
}

function deleteChannel(arn: IVS.Types.ChannelArn) {
  return ivsVideoClient.deleteChannel({ arn }).promise();
}

function stopStream(channelArn: IVS.Types.ChannelArn) {
  return ivsVideoClient.stopStream({ channelArn }).promise();
}

export { createChannel, deleteChannel, ivsVideoClient, stopStream };
