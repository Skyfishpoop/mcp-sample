const express = require("express");
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "リーダブルコード", author: "Dustin Boswell" },
  { id: 2, title: "達人プログラマー", author: "David Thomas" },
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const newBook = {
    id: Math.max(0, ...books.map((b) => b.id)) + 1,
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});
