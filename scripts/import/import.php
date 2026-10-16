<?php
    if (disk_free_space("/kitobplus/books/storage") <= 1024 * 1024 * 1024) {
		return;
	}

    require_once('preview.php');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit("$q: " . $db->error . "\n");
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

    $q = sql("select * from books where imported is null and id not in (select books_id from imports)");

    if ($row = $q->fetch_assoc()) {
        sql("insert into imports (books_id) values ($row[id])");

        $folder = "/kitobplus/books/import/books/" . $row['folder'];
	    if (!is_dir($folder)) exit("Folder $folder not found!\n");

        $books_id = $row['id'];

        echo $books_id . "\n";
/*
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
        exec("find " . escapeshellarg($folder) . "/ -iname '*.mp3'", $files, $ec);
        if (!count($files)) {
            echo "No mp3 files found - skip\n";
            exit;
        }

        sort($files);

        if (!mkdir("/kitobplus/books/storage/" . sprintf("%05d", $books_id))) exit("mkdir error!\n");

        $seconds = 0;
        $bytes = 0;
        $pos = 1;
        foreach ($files as $file) {
            $out = [];
            exec("soxi -D " . escapeshellarg($file), $out, $ec); if ($ec) exit("soxi for $file error!\n");
			$sha256 = hash_file('sha256', $file);
            sql("insert into files (books_id, pos, bytes, seconds, sha256) values ($books_id, $pos, " . filesize($file) . ", " . round(floatval($out[0]), 3) . ", '$sha256')");
            $seconds += round(floatval($out[0]), 3);
            $bytes += filesize($file);

            if (!copy($file, "/kitobplus/books/storage/" . sprintf("%05d", $books_id) . "/" . sprintf("%04d", $pos) . ".mp3")) exit("Copy error!\n");
            $pos++;
        }
        sql("update books set bytes = $bytes, seconds = $seconds, folder = '" . $db->escape_string(basename($folder)) . "' where id = $books_id");

        $backup = "/kitobplus/books/backup/" . basename($folder);
        if (is_dir($backup)) mkdir($backup, 0777, true);
	    rename($folder, $backup);

        genPreview($books_id, '/kitobplus/notifications/demo/tts/woman.wav');

        sql("update books set imported = now() where id = $books_id");
        sql("delete from imports where books_id = $books_id");

		sql("insert into books_cache_dirty (dt) values (now())");
    }
