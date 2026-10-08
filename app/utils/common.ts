/* simple timer to resolve after ms milliseconds */
export const timer = (ms: number): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve('timer end'), ms));
