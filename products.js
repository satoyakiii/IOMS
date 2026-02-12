
const express = require('express');
const { getDB, ObjectId } = require('../database/db');

const router = express.Router();


function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}


function validateProductPayload(payload) {
  if (!payload) return { ok: false, error: 'Missing body' };

  const { name, price, quantity } = payload;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return { ok: false, error: 'Invalid or missing field: name' };
  }

  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || !isFinite(priceNum) || priceNum < 0) {
    return { ok: false, error: 'Invalid or missing field: price' };
  }

  const qtyNum = Number(quantity);
  if (!Number.isInteger(qtyNum) || qtyNum < 0) {
    return { ok: false, error: 'Invalid or missing field: quantity' };
  }

  return { 
    ok: true, 
    data: { 
      name: name.trim(), 
      price: priceNum, 
      quantity: qtyNum 
    } 
  };
}


router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('products');

    
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    }

    
    const sortField = req.query.sortBy || 'name';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    
    let projection = {};
    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      fields.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const products = await collection
      .find(filter, { projection })
      .sort(sort)
      .toArray();

    res.status(200).json(products);
  } catch (err) {
    console.error('DB error GET /api/products:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const collection = db.collection('products');
    
    const product = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (err) {
    console.error('DB error GET /api/products/:id', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.post('/', async (req, res) => {
  const validation = validateProductPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, price, quantity } = validation.data;

  try {
    const db = getDB();
    const collection = db.collection('products');
    
    const newProduct = {
      name,
      price,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newProduct);
    
    res.status(201).json({
      _id: result.insertedId,
      name,
      price,
      quantity,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt
    });
  } catch (err) {
    console.error('DB error POST /api/products', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.put('/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const validation = validateProductPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, price, quantity } = validation.data;

  try {
    const db = getDB();
    const collection = db.collection('products');
    
    const updateDoc = {
      $set: {
        name,
        price,
        quantity,
        updatedAt: new Date()
      }
    };
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({
      _id: id,
      name,
      price,
      quantity,
      updatedAt: new Date()
    });
  } catch (err) {
    console.error('DB error PUT /api/products/:id', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const collection = db.collection('products');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DB error DELETE /api/products/:id', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;