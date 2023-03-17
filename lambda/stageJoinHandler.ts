import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { join } from "../src/join";
import { createApiGwResponse, isBodyMissingKey } from "./util";

async function stageJoinHandler(
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

  if (isBodyMissingKey(body, "attributes")) {
    return createApiGwResponse(400, {
      error: `Missing required parameter 'attributes'`,
    });
  }

  try {
    result = await join(body.groupId, body.userId, body.attributes || {});
  } catch (err) {
    return createApiGwResponse(400, {
      error: (err as Error).toString(),
    });
  }

  return createApiGwResponse(200, result);
}

export { stageJoinHandler };
