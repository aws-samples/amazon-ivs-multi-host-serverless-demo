import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { disconnect } from "../src/disconnect";
import { createApiGwResponse, isBodyMissingKey } from "./util";

async function stageDisconnectHandler(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  let body;
  let result;

  try {
    body = JSON.parse(event.body as string);
  } catch (err) {
    return createApiGwResponse(400, {
      error: `Failed to parse request body: ${(err as Error).toString()}`,
    });
  }

  if (isBodyMissingKey(body, "groupId")) {
    return createApiGwResponse(400, {
      error: `Missing required parameter 'groupId'`,
    });
  }

  if (isBodyMissingKey(body, "userId")) {
    return createApiGwResponse(400, {
      error: `Missing required parameter 'userId'`,
    });
  }

  if (isBodyMissingKey(body, "participantId")) {
    return createApiGwResponse(400, {
      error: `Missing required parameter 'participantId'`,
    });
  }

  try {
    await disconnect(
      body.groupId,
      body.userId,
      body.participantId,
      body.reason || "",
    );
    result = "";
  } catch (err) {
    return createApiGwResponse(400, {
      error: (err as Error).toString(),
    });
  }

  return createApiGwResponse(200, result);
}

export { stageDisconnectHandler };
