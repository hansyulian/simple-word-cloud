import { appConfig } from "../config";

export async function request(method, url, options = {}) {
  const response = await fetch(`${appConfig.apiEndpoint}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
    ...(options.json && { body: JSON.stringify(options.json) }),
  });
  const data = await response.json();
  return data
}