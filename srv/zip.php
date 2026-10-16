<?php
    if (!($id = intval($_GET['books_id']))) {
        echo "Incorrect request";
        http_response_code(400);
        exit;
    }

    $bookdir=  "/kitobplus/books/storage/" . sprintf("%05d", $id);
    if (!is_dir($bookdir)) {
        echo "Book directory not found";
        http_response_code(400);
        exit;
    }

    $base = "/var/www/html/zip";
    while(file_exists("$base/flags/$id")) sleep(1);
    
    if (!file_exists("$base/$id.zip")) {
        mkdir("$base/flags/$id");
        $out = [];
        exec("7zz a -tzip $base/$id.zip $bookdir/*.mp3", $out, $ec);
        if ($ec) {
            echo $ec . "\n" . implode("\n", $out);
            http_response_code(500);
        }
        rmdir("$base/flags/$id");
    }

    header("X-SendFile: $base/$id.zip");
    