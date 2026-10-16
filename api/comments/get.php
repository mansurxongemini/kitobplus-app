<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validateAnon(['books_id']);

    comments_success();
