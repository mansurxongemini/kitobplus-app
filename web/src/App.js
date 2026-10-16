import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom"
import HomePage from "./home/HomePage"
import { ThemeProvider } from "./parts/ThemeProvider"
import NotFound from "./NotFound"
import Login from "./Login"
import Profile from "./Profile"
import Books from "./books/Books";
import Genres from "./genres/Genres";
import { LibraryProvider } from "./LibraryContext";
import News from "./news/News";
import NewsView from "./news/NewsView";
import Person from "./person/Person";
import Contacts from "./contacts/Contacts";
import Book from "./book/Book";
import Persons from "./persons/Persons";

function App() {
  return (
    <LibraryProvider>    
      <Router basename={'/'}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:table/:id" element={<Books />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/persons/genres" element={<Genres />} />
            <Route path="/person/:table/:id" element={<Person/>} />
            <Route path="/persons/:table" element={<Persons/>} />
            <Route path="/books/:id" element={<Book/>} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </LibraryProvider>
  );
}

export default App;
