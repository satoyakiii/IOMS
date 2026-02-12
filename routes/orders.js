
const express = require('express');
const { getDB, ObjectId } = require('../database/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const orders = db.collection('orders');

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (!req.session || !req.session.userId) {
      return res.json({ page, limit, total: 0, items: [] });
    }
    
    if (req.session.role !== 'admin') {
      filter.userId = new ObjectId(req.session.userId);
    }

    const cursor = orders.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const data = await cursor.toArray();
    const total = await orders.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      items: data
    });
  } catch (err) {
    console.error('GET /api/orders error', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const orders = db.collection('orders');
    const products = db.collection('products');

    const userId = req.session.userId;
    const { productId, quantity = 1, deliveryAddress = '' } = req.body;

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.quantity < qty) return res.status(400).json({ error: 'Not enough stock' });

    const totalPrice = Number(product.price) * qty;

    const newOrder = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      quantity: qty,
      totalPrice,
      status: 'pending',
      deliveryAddress: deliveryAddress.toString(),
      createdAt: new Date()
    };

    const r = await orders.insertOne(newOrder);

    await products.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { quantity: -qty }, $set: { updatedAt: new Date() } }
    );

    res.status(201).json({ _id: r.insertedId, ...newOrder });
  } catch (err) {
    console.error('POST /api/orders error', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const { status } = req.body;
    const allowed = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const db = getDB();
    const orders = db.collection('orders');

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'Order not found' });
    res.json(result.value);
  } catch (err) {
    console.error('PATCH /api/orders/:id/status error', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const db = getDB();
    const orders = db.collection('orders');

    const existing = await orders.findOne({ _id: new ObjectId(id) });
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    const isOwner = String(existing.userId) === String(req.session.userId);
    const isAdmin = req.session.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });


    await orders.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('DELETE /api/orders/:id error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
