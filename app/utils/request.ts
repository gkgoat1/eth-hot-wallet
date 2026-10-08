/**
 * Parses the JSON returned by a network request
 */
function parseJSON(response: Response): Promise<unknown> | null {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

export class RequestError extends Error {
  response: Response;
  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

/**
 * Checks if a network request came back fine, and throws an error if not
 */
function checkStatus(response: Response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new RequestError(response.statusText, response);
}

/**
 * Requests a URL, returning a promise of the parsed JSON
 */
export default function request<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options)
    .then(checkStatus)
    .then((res) => parseJSON(res)) as Promise<T>;
}
