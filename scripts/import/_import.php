<?php
    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

    function getId($table, $name) {
        global $db;
        if ($row = sql("select id from $table where name = '" . $db->escape_string($name) . "'")->fetch_assoc()) return $row['id'];
        sql("insert into $table (name) values ('" . $db->escape_string($name) . "')");
        return $db->insert_id;
    }

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
    
    
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    $f = fopen("initial.csv", "r");
    $head = fgetcsv($f);

    $author_column = array_search("Автор", $head);
    $name_column = array_search("Название", $head);
    $dictor_column = array_search("Диктор", $head);
    $genres_column = array_search("Жанр", $head);
    $publisher_column = array_search("Издательство", $head);
    $annotation_column = array_search("Описание", $head);
    $folder_column = array_search("Папка", $head);
    while ($row = fgetcsv($f)) {
//        $folder = "/kitobplus/books/import/" . $row[$folder_column];
        $folder = "/kitobplus/books/backup/" . str_replace("/books/", "/", $row[$folder_column]);
	    if (!is_dir($folder)) continue;
        echo $row[$folder_column] . "\n";

        $q = sql("select * from books_view where authors_name = '" . $db->escape_string($row[$author_column]) . "' and dictors_name = '" . $db->escape_string($row[$dictor_column]) . "' and name = '" . $db->escape_string($row[$name_column]) . "'");
        if (!$sql_row = $q->fetch_assoc()) {
            echo "Not found!\n";
            var_dump($row);
            exit;
        }

        $books_id = $sql_row['id'];

/*       	
        $backup = "/kitobplus/books/backup/" . basename($row[$folder_column]);
	    rename($folder, $backup);
	    continue;

        if (sql("select * from books where name = '" . $db->escape_string($row[$name_column]) . "'")->fetch_assoc()) {
            echo "Already imported - skip!\n";
            continue;
        }

        sql("insert into books (name, publishers_id, annotation) values ('" .
            $db->escape_string($row[$name_column]) . "', '" .
            getId('publishers', $row[$publisher_column]) . "', '" .
            $db->escape_string($row[$annotation_column]) . "')");

        $books_id = $db->insert_id;

        sql("insert into books2authors (books_id, authors_id) values ($books_id, " . getId('authors', $row[$author_column]) . ")");
        sql("insert into books2dictors (books_id, dictors_id) values ($books_id, " . getId('dictors', $row[$dictor_column]) . ")");

        foreach (explode(",", $row[$genres_column]) as $genre) {
            if (trim($genre)) {
                sql("insert into books2genres (books_id, genres_id) values ($books_id, " . getId('genres', trim($genre)) . ")");
            }
        }
*/
        $files = [];
        exec("find " . escapeshellarg($folder) . "/ -name '*.mp3'", $files, $ec);
        if (!count($files)) {
            echo "No mp3 files found - skip\n";
            continue;
        }

        sort($files);        

        //if (!mkdir("/kitobplus/books/storage/" . sprintf("%05d", $books_id))) exit("mkdir error!\n");
        $seconds = 0;
        $bytes = 0;
        $pos = 1;
        foreach ($files as $file) {
            $out = [];
            exec("soxi -D " . escapeshellarg($file), $out, $ec); if ($ec) exit("soxi for $file error!\n");
            sql("insert into files (books_id, pos, bytes, seconds) values ($books_id, $pos, " . filesize($file) . ", " . round(floatval($out[0]), 3) . ")");
            $seconds += round(floatval($out[0]), 3);
            $bytes += filesize($file);

            if (!copy($file, "/kitobplus/books/storage/" . sprintf("%05d", $books_id) . "/" . sprintf("%04d", $pos) . ".mp3")) exit("Copy error!\n");
            $pos++;
        }
        sql("update books set bytes = $bytes, seconds = $seconds, folder = '" . $db->escape_string($row[$folder_column]) . "' where id = $books_id");
        //break;

        //sql("insert int 
    }




