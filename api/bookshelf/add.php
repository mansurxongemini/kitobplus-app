<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate('books_id');

    query(" INSERT INTO bookshelfs (users_id, books_id, dt) VALUES (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", NOW())            
            ON DUPLICATE KEY UPDATE users_id = " . $params['user']['id']);

    query("insert into bookshelfs_history (users_id, books_id, dt, is_add) values (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", NOW(), 1)");

    bookshelf_success();
