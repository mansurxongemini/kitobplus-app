<?php
    require_once('../../api/connect2db.php');
    
    $limit = "";
    $books = [];
    $query = "select books.id, books.name, books.annotation";
    foreach (['authors', 'dictors', 'genres'] as $table) {
        $query .= ", bv." . $table . "_name, group_concat(distinct books2$table." . $table . "_id order by books2$table.pos) as $table";
    }
    $query .= "\nfrom books join books_view bv on books.id = bv.id";
    foreach (['authors', 'dictors', 'genres'] as $table) {
        $query .= "\nleft join books2$table on books.id = books2$table.books_id";
    }
	$query .= "\nwhere books.is_readable_from < now()";
    $query .= "\ngroup by books.id";

    $books = [];
    $index = ['authors' => [], 'dictors' => [], 'genres' => []];
    foreach (fetch_all($query) as $row) {
        $book = [
            'id' => intval($row['id']),
            'title' => $row['name'],
            'annotation' => $row['annotation']
        ];

        foreach (['authors', 'dictors', 'genres'] as $t) {
            $book[$t] = [
                'id' => array_map("intval", array_filter(explode(",", $row[$t]))),
                'name' => $row[$t . "_name"] ?? ""
            ];
            foreach ($book[$t]['id'] as $_) {
                $index[$t][] = $_;
            }
        }
        $books[] = $book;
        echo "\r" . count($books);
    }
    echo "\n";
    $lib = ['books' => $books];

    foreach (['authors', 'dictors', 'genres'] as $t) {
        echo "Export $t\n";
        $lib[$t] = array_map(function($_){return ['id' => intval($_['id']), 'name' => $_['name']];}, fetch_all("select * from $t where id in (" . implode(",", array_unique($index[$t])) . ")"));
    }

    file_put_contents("kitob.json", json_encode($lib, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo count($books) . " books exported\n";
    echo count($lib['authors']) . " authors exported\n";    
    echo count($lib['dictors']) . " dictors exported\n";
    echo count($lib['genres']) . " genres exported\n";

    ksort($lib['genres']);
    $genres = [];
    foreach ($lib['genres'] as $genre) {
        $genres[] = "$genre[id]. $genre[name]";
    }
    file_put_contents("genres.txt", implode("\n", $genres));
