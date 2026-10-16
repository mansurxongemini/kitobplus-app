<?php
    require_once('../../api/connect2db.php');
    
    $limit = "";
    $books = [];
    foreach (fetch_all("select bv.*, b.annotation from books_view bv join books b on bv.id = b.id group by bv.id order by rand() " . ($limit ? "limit $limit" : "")) as $book) {
        if (!trim($book['annotation'])) continue;
        $books[] = [
            'id' => $book['id'],
            'author' => $book['authors_name'],
            'title' => $book['name'],
            'narrator' => $book['dictors_name'],
            'genre' => $book['genres_name'],
            'annotation' => $book['annotation']
        ];
    }

    file_put_contents("books$limit.json", json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo count($books) . " books exported\n";
