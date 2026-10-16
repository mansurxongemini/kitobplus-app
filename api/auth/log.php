<?php
    require_once('../connect2db.php');

    $params = validateAnon(['log']);
    file_put_contents('logs/' . date("YmdHis") . ".json", json_encode($params));
    exit(json_encode(['success' => true]));
