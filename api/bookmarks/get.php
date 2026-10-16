<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validate(['books_id']);

    bookmarks_success();
