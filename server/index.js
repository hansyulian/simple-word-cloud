// server.js
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const words = []; // { id, word, userId }

app.get("/words", (req, res) => {
  const { userId } = req.query;

  const filteredWords = userId ? words.filter(w => w.userId === userId) : words;

  const result = filteredWords
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.text === curr.word);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ id: curr.id, text: curr.word, count: 1 });
      }
      return acc;
    }, []);

  res.json(result);
});

app.post("/clear", (req, res) => {
  words.length = 0;
  res.json({ success: true });
})

app.post("/words", (req, res) => {
  const { word, userId } = req.body;
  if (!word || !userId) {
    return res.status(400).json({ error: "Missing word or userId" });
  }

  if (words.find(w => w.word === word && w.userId === userId)) {
    res.status(200).json({ success: true });
    return;
  }
  const id = uuidv4();
  words.push({ id, word, userId });
  console.log(`✅ Word submitted: "${word}" from user "${userId}"`);
  res.status(201).json({ success: true, id });
});

app.delete("/words/:id", (req, res) => {
  const { id } = req.params;
  const index = words.findIndex(w => w.id === id);
  if (index === -1) return res.status(404).json({ error: "Word not found" });

  words.splice(index, 1);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
