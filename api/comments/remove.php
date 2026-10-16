<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate(['id', 'books_id']);
    $id = intval($params['id']);

    check_permissions($id);

    query("DELETE FROM comments where id = $id");

    comments_success();
