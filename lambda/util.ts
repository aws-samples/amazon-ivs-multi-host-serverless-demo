import { APIGatewayProxyResult } from "aws-lambda";

function getResponseHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
  };
}

function createApiGwResponse(
  statusCode: number,
  result: unknown,
): APIGatewayProxyResult {
  const headers = getResponseHeaders();

  const body = JSON.stringify(result);

  return {
    headers,
    statusCode,
    body,
  };
}

function isBodyMissingKey(body: unknown, key: string) {
  const keyExistsOnBody = Object.prototype.hasOwnProperty.call(body, key);

  return !keyExistsOnBody;
}

export { createApiGwResponse, getResponseHeaders, isBodyMissingKey };
