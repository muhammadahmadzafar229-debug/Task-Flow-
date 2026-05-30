const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'YOUR_MONGODB_CONNECTION_STRING';
const DB_NAME = 'taskflow';
const COLLECTION = 'tasks';

let db;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ MongoDB se connect ho gaya!');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// ── ROUTES ──

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow backend chal raha hai!' });
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    console.log(`📋 GET /api/tasks — ${tasks.length} tasks mile`);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { text, priority = 'medium' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text zaroori hai' });
    }
    const task = {
      text: text.trim(),
      priority,
      done: false,
      createdAt: new Date()
    };
    const result = await db.collection(COLLECTION).insertOne(task);
    const newTask = { ...task, _id: result.insertedId };
    console.log(`✅ POST /api/tasks — Naya task: "${text}"`);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update task
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates._id;

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    const updated = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    console.log(`🔄 PATCH /api/tasks/${id} — Updated`);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    console.log(`🗑️ DELETE /api/tasks/${id}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server chal raha hai: http://localhost:${PORT}`);
    console.log(`📱 App: http://localhost:${PORT}/index.html`);
  });
});
