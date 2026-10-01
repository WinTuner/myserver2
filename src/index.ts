import express from 'express';
import { add } from './add';
import { order } from './order';

export const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World');
});

app.get('/api/add', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    res.status(400).json({ error: 'a and b must be numbers' });
    return;
  }
  res.json(add(a, b));
});

app.post('/api/orders', (req, res) => {
  const { items, discountPct = 0, vatPct = 0 } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'items must be non-empty' });
    return;
  }
  res.json(order(items, discountPct, vatPct));
});

app.use((_req, res) => {
  res.status(404).send('Not Found');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('up 3000'));
}
