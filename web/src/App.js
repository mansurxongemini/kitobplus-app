import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom"
import HomePage from "./home/HomePage"
import { ThemeProvider } from "./parts/ThemeProvider"
import { LibraryProvider } from "./LibraryContext";
import ErrorBoundary from "./ds/components/ErrorBoundary";
import T from "./lib/translator";
import { Box, CircularProgress } from "@mui/material";

const Login = React.lazy(() => import("./Login"));
const Profile = React.lazy(() => import("./Profile"));
const Books = React.lazy(() => import("./books/Books"));
const Genres = React.lazy(() => import("./genres/Genres"));
const News = React.lazy(() => import("./news/News"));
const NewsView = React.lazy(() => import("./news/NewsView"));
const Person = React.lazy(() => import("./person/Person"));
const Contacts = React.lazy(() => import("./contacts/Contacts"));
const Book = React.lazy(() => import("./book/Book"));
const Persons = React.lazy(() => import("./persons/Persons"));
const NotFound = React.lazy(() => import("./NotFound"));

// В sx число ≤ 1 означает долю (width: 1 = 100%), поэтому размеры — строкой.
const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

function RouteFallback() {
  const loadingText = T("Загрузка…");
  return (
    <Box
      role="status"
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress aria-hidden="true" />
      <Box component="span" sx={visuallyHidden}>{loadingText}</Box>
    </Box>
  );
}

function App() {
  return (
    <LibraryProvider>
      <Router basename={'/'}>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </LibraryProvider>
  );
}

export default App;
