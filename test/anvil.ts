/**
 * Anvil (Foundry) test harness — spawns a local chain per test file.
 *
 * Fail-closed: if the `anvil` binary is unavailable the suite throws at
 * setup instead of silently skipping (plan §3.2).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { execFileSync } from 'node:child_process';

export interface AnvilInstance {
  url: string;
  port: number;
  chainId: number;
  process: ChildProcess;
  stop: () => Promise<void>;
  rpc: <T = unknown>(method: string, params?: unknown[]) => Promise<T>;
}

const ANVIL_BIN = process.env.ANVIL_BIN ?? 'anvil';
const START_TIMEOUT_MS = 30_000;

export function assertAnvilAvailable(): void {
  try {
    execFileSync(ANVIL_BIN, ['--version'], { stdio: 'pipe' });
  } catch (err) {
    throw new Error(
      `Anvil binary not found/executable as "${ANVIL_BIN}". ` +
        'Install Foundry (https://book.getfoundry.sh/getting-started/installation) ' +
        'or set ANVIL_BIN. Anvil is a hard prerequisite for integration tests ' +
        '(plan §3.2); refusing to skip.',
      { cause: err },
    );
  }
}

async function rpcCall<T>(url: string, method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = (await res.json()) as {
    result?: T;
    error?: { code: number; message: string };
  };
  if (body.error) {
    throw new Error(`anvil rpc ${method} failed: ${body.error.message}`);
  }
  return body.result as T;
}

async function waitForReady(url: string, proc: ChildProcess): Promise<void> {
  const deadline = Date.now() + START_TIMEOUT_MS;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`anvil exited early with code ${proc.exitCode}`);
    }
    try {
      await rpcCall(url, 'eth_chainId');
      return;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`anvil did not become ready within ${START_TIMEOUT_MS}ms`, {
    cause: lastErr,
  });
}

export async function startAnvil(options: { chainId?: number } = {}): Promise<AnvilInstance> {
  assertAnvilAvailable();
  const chainId = options.chainId ?? 31337;
  // --port 0 lets the OS pick a free port. The "Listening on ..." line
  // may go to stdout or stderr depending on anvil version and is
  // suppressed by --silent, so we keep normal verbosity and parse both.
  const proc = spawn(
    ANVIL_BIN,
    ['--port', '0', '--chain-id', String(chainId)],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  const port = await new Promise<number>((resolve, reject) => {
    let buf = '';
    let settled = false;
    const onData = (chunk: Buffer) => {
      buf += chunk.toString();
      const m = buf.match(/Listening on (?:127\.0\.0\.1|\[?::1\]?|0\.0\.0\.0):(\d+)/);
      if (m && !settled) {
        settled = true;
        resolve(Number(m[1]));
      }
    };
    proc.stdout?.on('data', onData);
    proc.stderr?.on('data', onData);
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (!settled) {
        reject(new Error(`anvil exited before announcing port (code ${code}): ${buf}`));
      }
    });
    setTimeout(() => {
      if (!settled) {
        reject(new Error(`anvil port announce timeout; got: ${buf}`));
      }
    }, START_TIMEOUT_MS);
  });

  const url = `http://127.0.0.1:${port}`;
  try {
    await waitForReady(url, proc);
  } catch (err) {
    proc.kill('SIGKILL');
    throw err;
  }

  return {
    url,
    port,
    chainId,
    process: proc,
    rpc: <T>(method: string, params: unknown[] = []) => rpcCall<T>(url, method, params),
    stop: () =>
      new Promise((resolve) => {
        proc.once('exit', () => resolve());
        proc.kill('SIGTERM');
        setTimeout(() => {
          proc.kill('SIGKILL');
          resolve();
        }, 5_000).unref();
      }),
  };
}
