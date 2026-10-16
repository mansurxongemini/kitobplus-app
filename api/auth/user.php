<?php
    require_once('../connect2db.php');

    $params = validate('token');

    exit(json_encode(['success' => true, 'user' => $params['user']]));
