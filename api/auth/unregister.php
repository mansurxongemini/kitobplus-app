<?php
    require_once('../connect2db.php');

    $params = validate(['code', 'phone']);
    $clean_phone = preg_replace('/[^0-9]/', '', $params['phone']);

    if ($params['user']['phone'] != $clean_phone) {
        exit(json_encode(['success' => false, 'error' => 'Incorrect phone']));
    }

    query("select * from sms where phone = '" . escape($params['phone']) . "' and code = '" . escape($params['code']) . "'");
    if (!fetch()) {
        exit(json_encode(['success' => false, 'error' => 'Incorrect verification code']));
    }

    query("update users set deleted = NOW() where id = " . $params['user']['id']);

    exit(json_encode(['success' => true]));
