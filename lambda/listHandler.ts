import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { scanGroups } from "../src/sdk/ddb";
import { createApiGwResponse } from "./util";

async function listHandler(
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
  let result;

  try {
    result = await scanGroups();
  } catch (err) {
    return createApiGwResponse(400, {
      error: (err as Error).toString(),
    });
  }

  return createApiGwResponse(200, result);
}

export { listHandler };
