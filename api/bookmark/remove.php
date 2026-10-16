<?php
    require_once('../connect2db.php');

    $params = validate('books_id');

    query("delete from bookshelfs where users_id = " . $params['user']['id'] . " and books_id = " . intval($params['books_id']));

    exit(json_encode(['success' => true]));
