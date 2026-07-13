const express = require('express');
const cors = require('cors');
const { initSchema } = require('./db/schema');

initSchema();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`PilotParts API running on http://localhost:${PORT}`);
});
