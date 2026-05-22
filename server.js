// =============================================
// KAAM KARO — Backend Server
// Node.js + Express
// =============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ---- Middleware ----
app.use(cors());                    // Frontend ko allow karo
app.use(express.json());            // JSON data parse karo
app.use(express.static('./')); // Frontend serve karo

// =============================================
// IN-MEMORY DATABASE (practice ke liye)
// Baad mein MongoDB se replace karna
// =============================================
let tasks = [
  { _id: '1', text: 'HTML aur CSS revise karo', priority: 'high', done: true },
  { _id: '2', text: 'JavaScript fetch API seekho', priority: 'high', done: false },
  { _id: '3', text: 'Backend se connect karo', priority: 'medium', done: false },
];

let nextId = 4; // auto increment ID

// =============================================
// ROUTES (API endpoints)
// =============================================

// GET /api/tasks — Sare tasks lao
app.get('/api/tasks', (req, res) => {
  console.log('📋 GET /api/tasks — ' + tasks.length + ' tasks mil gaye');
  res.json(tasks);
});

// POST /api/tasks — Naya task add karo
app.post('/api/tasks', (req, res) => {
  const { text, priority } = req.body;

  // Validation — khaali text allow nahi
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text zaroori hai!' });
  }

  const newTask = {
    _id: String(nextId++),
    text: text.trim(),
    priority: priority || 'medium',
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask); // list ke upar add karo
  console.log('✅ POST /api/tasks — Naya task: ' + newTask.text);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id — Task update karo (done toggle)
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t._id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task nahi mila!' });
  }

  // Sirf allowed fields update karo
  if (req.body.done !== undefined) task.done = req.body.done;
  if (req.body.text) task.text = req.body.text;
  if (req.body.priority) task.priority = req.body.priority;

  console.log('🔄 PATCH /api/tasks/' + req.params.id + ' — Updated');
  res.json(task);
});

// DELETE /api/tasks/:id — Task delete karo
app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t._id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task nahi mila!' });
  }

  const deleted = tasks.splice(index, 1)[0];
  console.log('🗑️  DELETE /api/tasks/' + req.params.id + ' — Deleted: ' + deleted.text);
  res.json({ message: 'Task delete ho gaya', task: deleted });
});

// DELETE /api/tasks — Sare done tasks clear karo
app.delete('/api/tasks', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => !t.done);
  console.log('🧹 Cleared ' + (before - tasks.length) + ' done tasks');
  res.json({ message: 'Mukammal tasks hata diye' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', tasks: tasks.length, message: 'Server chal raha hai!' });
});

// =============================================
// SERVER START
// =============================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Kaam Karo Backend chal raha hai!');
  console.log('📡 URL: http://localhost:' + PORT);
  console.log('🌐 App: http://localhost:' + PORT + '/index.html');
  console.log('');
  console.log('Available API routes:');
  console.log('  GET    /api/tasks       — sare tasks');
  console.log('  POST   /api/tasks       — naya task');
  console.log('  PATCH  /api/tasks/:id   — task update');
  console.log('  DELETE /api/tasks/:id   — task delete');
  console.log('');
});
