import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; 

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 


  useEffect(() => {
    axios.get("/books").then((res) => setBooks(res.data));
  }, []);

  const validateFields = () => {
    if (!title.trim() || !author.trim() || !year.trim()) {
      setErrorMessage("Fields cannot be empty! ");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const addBook = async () => {
    if (!validateFields()) return; 

    const newBook = { title, author, year };
    const res = await axios.post("/books", newBook);
    setBooks([...books, res.data]);
    resetForm();
  };

  const deleteBook = async (id) => {
    await axios.delete(`/books/${id}`);
    setBooks(books.filter((book) => book._id !== id));
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
  };


  const updateBook = async () => {
    if (!validateFields()) return; 

    const updatedBook = { title, author, year };
    const res = await axios.put(`/books/${editingBook._id}`, updatedBook);

    setBooks(
      books.map((book) =>
        book._id === editingBook._id ? res.data : book
      )
    );
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setYear("");
    setEditingBook(null);
    setErrorMessage("");
  };

  return (
    <div className="app-container">
      <h1>📚 Book Management System</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="input-container">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          placeholder="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {editingBook ? (
          <button onClick={updateBook}>Update Book </button>
        ) : (
          <button onClick={addBook}>Add Book </button>
        )}
      </div>

      <ul className="book-list">
        {books.map((book) => (
          <li key={book._id}>
            <span>
              {book.title} - {book.author} ({book.year})
            </span>
            <div>
              <button onClick={() => startEdit(book)}> Edit</button>
              <button onClick={() => deleteBook(book._id)}> Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
