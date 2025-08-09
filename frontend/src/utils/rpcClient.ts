const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/rpc';

interface JsonRpcResponse<TResult> {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: TResult;
  error?: {
    code: number;
    message: string;
    data?: string;
  };
}

export async function rpcClient<TResult = unknown,  P extends Record<string, any> | undefined = undefined>(
  method: string,
  params?: P
): Promise<TResult> {
  const requestId = Date.now(); // Unique-enough ID per frontend session
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: requestId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonRpcResponse: JsonRpcResponse<TResult> = await response.json();

  if (jsonRpcResponse.error) {
    throw new Error(`RPC Error: ${jsonRpcResponse.error.message}`);
  }

  return jsonRpcResponse.result!;
}
