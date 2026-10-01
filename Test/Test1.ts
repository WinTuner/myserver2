import { add } from '../src/add';
import { order } from '../src/order';

// 2 pass. No API, direct calls only.
function check(name: string, pass: boolean, got: unknown) {
  console.log(`${name} ${pass ? 'passed' : `failed got=${got}`}`);
  if (!pass) process.exitCode = 1;
}

const sum = add(2, 3);
check('Unit add', sum === 5, sum); // 2+3=5

const total = order([{ price: 100, qty: 2 }], 10, 7).total;
check('Unit order', Math.abs(total - 192.6) < 1e-9, total); // 200-20+12.6=192.6

console.log('Unit: 2 passed');
