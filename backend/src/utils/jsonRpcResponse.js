function jsonRpcSuccessResponse(id, result) {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

function jsonRpcErrorResponse(code, message, id, data = null) {
  return {
    jsonrpc: "2.0",
    error: {
      code,
      message,
      data,
    },
    id,
  };
}

export { jsonRpcErrorResponse, jsonRpcSuccessResponse };
