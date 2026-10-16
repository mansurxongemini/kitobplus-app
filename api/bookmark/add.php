<?php
    require_once('../connect2db.php');

    $params = validate('books_id');

    query(" INSERT INTO bookshelfs (users_id, books_id, dt) VALUES (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", NOW())            
            ON DUPLICATE KEY UPDATE users_id = " . $params['user']['id']);

    exit(json_encode(['success' => true]));
