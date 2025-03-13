const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


router.post("/", async (req, res) => {
    const { title, author, year } = req.body;
  
    if (!title || !author || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const newBook = new Book({ title, author, year });
    await newBook.save();
    res.json(newBook);
  });
  
router.delete("/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted successfully" });
});

router.put("/:id", async (req, res) => {
    const { title, author, year } = req.body;
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { title, author, year },
        { new: true }
      );
      res.json(updatedBook);
    } catch (err) {
      res.status(400).json({ message: "Failed to update book" });
    }
  });
  

module.exports = router;
