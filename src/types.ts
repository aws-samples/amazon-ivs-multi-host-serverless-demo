import { IVS, Ivschat, IVSRealTime } from "aws-sdk";

type UserAttributes = {
  avatarUrl: string;
  username: string;
};

type ChannelResponse = {
  id: IVS.Types.ChannelArn;
  playbackUrl: IVS.Types.PlaybackURL;
  ingestEndpoint: IVS.Types.IngestEndpoint;
  streamKey: IVS.Types.StreamKeyValue;
};

type RoomResponse = {
  id: Ivschat.Types.RoomIdentifier;
  token: Ivschat.Types.CreateChatTokenResponse;
};

type StageResponse = {
  id: IVSRealTime.Types.StageArn;
  token: IVSRealTime.Types.ParticipantToken;
};

type Headers = {
  "Content-Type": string;
  "Access-Control-Allow-Headers": string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
};

type MultiHostGroup = {
  groupId: string;
  channelId: IVS.Types.ChannelArn;
  roomId: Ivschat.Types.RoomIdentifier;
  stageAttributes: UserAttributes;
  stageId: IVSRealTime.Types.StageArn;
};

export {
  ChannelResponse,
  Headers,
  MultiHostGroup,
  RoomResponse,
  StageResponse,
  UserAttributes,
};
