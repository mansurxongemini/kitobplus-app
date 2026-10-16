<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate('books_id');

    query("delete from bookshelfs where users_id = " . $params['user']['id'] . " and books_id = " . intval($params['books_id']));

	query("insert into bookshelfs_history (users_id, books_id, dt, is_add) values (" . $params['user']['id'] . ", " . intval($params['books_id']) . ", NOW(), 0)");

    bookshelf_success();
