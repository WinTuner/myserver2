import { app } from '../src/index';

const BASE = 'http://127.0.0.1:3456';

function check(name: string, pass: boolean, detail: unknown = '') {
  console.log(`${name} ${pass ? 'passed' : `failed ${detail}`}`);
  if (!pass) process.exitCode = 1;
}

const server = app.listen(3456, async () => {
  try {
    const addRes = await (await fetch(`${BASE}/api/add?a=2&b=3`)).json();
    check('Integration add', addRes === 5, addRes); // 2+3=5

    const orderRes = await (
      await fetch(`${BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ price: 100, qty: 2 }],
          discountPct: 10,
          vatPct: 7,
        }),
      })
    ).json();
    check('Integration order', orderRes.total === 999, JSON.stringify(orderRes)); // fail demo: real is 192.6

    console.log('Integration: 1 passed, 1 failed');
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
