import React from "react";
import { Box } from "@mui/material";
import { LazyShelf } from "../ds/components/Shelf";
import { getHost } from "../lib/api.js";
import T from "../lib/translator.js";

// Shelves below the book tabs: similar books, other works by the author and
// other books read by the narrator. Empty shelves are hidden by LazyShelf.
const Recommendations = ({ book }) => {
  const bookId = book && typeof book === "object" ? book.id : book;
  if (!bookId) return null;
  const b = book && typeof book === "object" ? book : {};
  // books/get отдаёт авторов и чтецов массивами; authors_id/dictors_id бывают только в данных карточки каталога.
  const firstAuthor = (Array.isArray(b.authors) && b.authors[0]) || null;
  const firstDictor = (Array.isArray(b.dictors) && b.dictors[0]) || null;
  const author = {
    authors_id: firstAuthor ? firstAuthor.id : b.authors_id,
    authors_name: firstAuthor ? firstAuthor.name : b.authors_name,
    dictors_id: firstDictor ? firstDictor.id : b.dictors_id,
    dictors_name: firstDictor ? firstDictor.name : b.dictors_name,
  };
  const descriptors = [
    {
      key: "similar",
      id: "book-similar-title",
      title: T("Похожие книги"),
      to: "/books",
      count: 10,
      url: `${getHost()}/srv/books.php?recommendations=${bookId}`,
    },
  ];
  if (author.authors_id) {
    descriptors.push({
      key: "author",
      id: "book-author-title",
      title: `${author.authors_name} — ${T("другие произведения")}`,
      to: `/person/authors/${author.authors_id}`,
      count: 10,
      excludeId: bookId,
      url: `${getHost()}/srv/books.php?authors_id=${author.authors_id}&sort=new&page=0&per_page=10`,
    });
  }
  if (author.dictors_id) {
    descriptors.push({
      key: "dictor",
      id: "book-dictor-title",
      title: `${author.dictors_name} ${T("читал другие книги")}`,
      to: `/person/dictors/${author.dictors_id}`,
      count: 10,
      excludeId: bookId,
      url: `${getHost()}/srv/books.php?dictors_id=${author.dictors_id}&sort=new&page=0&per_page=10`,
    });
  }
  return (
    <Box sx={{ mt: { xs: 2, md: 4 } }}>
      {descriptors.map((d) => <LazyShelf key={d.key} descriptor={d} />)}
    </Box>
  );
};

export default Recommendations;
