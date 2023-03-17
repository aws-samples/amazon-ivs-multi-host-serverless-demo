import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteGroupAndResources } from "../src/delete";
import { createApiGwResponse, isBodyMissingKey } from "./util";

async function deleteHandler(
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

  try {
    await deleteGroupAndResources(body.groupId);
    result = "";
  } catch (err) {
    return createApiGwResponse(400, {
      error: (err as Error).toString(),
    });
  }

  return createApiGwResponse(200, result);
}

export { deleteHandler };
