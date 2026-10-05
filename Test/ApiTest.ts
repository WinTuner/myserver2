import type { Server } from 'node:http';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';

let failures = 0;
function check(name: string, pass: boolean, detail: unknown = '') {
  console.log(`${name} ${pass ? 'passed' : `failed ${detail}`}`);
  if (!pass) failures += 1;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDb(tries = 60) {
  for (let i = 0; i < tries; i++) {
    if (mongoose.connection.readyState === 1) return;
    await sleep(500);
  }
  throw new Error(`DB not connected (state=${mongoose.connection.readyState}). Set MONGODB_URI.`);
}

async function main() {
  const { app } = await import('../src/index');
  const server: Server = app.listen(0, async () => {
    const port = (server.address() as { port: number }).port;
    const BASE = `http://127.0.0.1:${port}`;
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI missing. Locally: set it in .env. CI: add repo secret MONGODB_URI.');
      }
      await waitForDb();

      const tag = Date.now();
      const email = `apitest${tag}@example.com`;

      // CREATE
      const createRes = await fetch(`${BASE}/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'ApiTest', email, password: 'secret123' }),
      });
      const created = await createRes.json();
      check('API create 201', createRes.status === 201 && !!created._id, createRes.status);
      const id = created._id as string;

      // READ list contains new user
      const listRes = await fetch(`${BASE}/api`);
      const list = await listRes.json();
      check(
        'API list contains new',
        listRes.status === 200 && Array.isArray(list) && list.some((u) => u._id === id),
        listRes.status,
      );

      // READ one
      const oneRes = await fetch(`${BASE}/api/${id}`);
      const one = await oneRes.json();
      check('API get one 200', oneRes.status === 200 && one.email === email, oneRes.status);

      // UPDATE without password (keeps old password)
      const updateRes = await fetch(`${BASE}/api/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'ApiUpdated', email }),
      });
      const updated = await updateRes.json();
      check('API update 200', updateRes.status === 200 && updated.name === 'ApiUpdated', updateRes.status);

      // DELETE
      const delRes = await fetch(`${BASE}/api/${id}`, { method: 'DELETE' });
      check('API delete 200', delRes.status === 200, delRes.status);

      // GET after delete -> 404
      const goneRes = await fetch(`${BASE}/api/${id}`);
      check('API get-after-delete 404', goneRes.status === 404, goneRes.status);

      console.log(failures === 0 ? 'API: all passed' : `API: ${failures} failed`);
      process.exitCode = failures === 0 ? 0 : 1;
    } catch (err) {
      console.error('API test error', err);
      process.exitCode = 1;
    } finally {
      server.close();
      await mongoose.disconnect().catch(() => {});
    }
  });
}

main().catch((err) => {
  console.error('API test error', err);
  process.exitCode = 1;
});
