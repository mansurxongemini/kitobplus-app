<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate(['books_id', 'track', 'position']);

    query("
        DELETE FROM bookmarks
        where
            users_id = " . $params['user']['id'] . " and
            books_id = " . intval($params['books_id']) . " and
            track = " . intval($params['track']) . " and
            position = " . intval($params['position'])
    );

    bookmarks_success();
