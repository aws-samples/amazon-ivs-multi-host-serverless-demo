import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { create } from "../src/create";
import { createApiGwResponse, isBodyMissingKey } from "./util";

async function createHandler(
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

  if (isBodyMissingKey(body, "userId")) {
    return createApiGwResponse(400, {
      error: `Missing required parameter 'userId'`,
    });
  }

  try {
    result = await create(
      body.groupId || "",
      body.userId,
      body.attributes || {},
    );
  } catch (err) {
    return createApiGwResponse(400, {
      error: (err as Error).toString(),
    });
  }

  return createApiGwResponse(200, result);
}

export { createHandler };
