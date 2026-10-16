<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate(['id', 'books_id', 'comment']);
    $id = intval($params['id']);

    check_permissions($id);
    
    query("
        INSERT INTO comments
        (
            id,
            users_id,
            dt,
            books_id,
            comment
        )
        VALUES
        (
            $id,
            " . $params['user']['id'] . ",
            NOW(),
            " . intval($params['books_id']) . ",
            '" . escape($params['comment']) . "'
        )
        ON DUPLICATE KEY UPDATE
            dt = NOW(),
            comment = '" . escape($params['comment']) . "'
    ");

    comments_success();
