<?php
    require_once('../connect2db.php');

    $params = validate(['id']);
    
    onlyAdmin($params);

    $id = intval($params['id']);

    query("update news set deleted = now() where id = $id");

    exit(json_encode(['success' => true]));