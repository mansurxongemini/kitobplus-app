<?php
    require_once('../connect2db.php');
    require_once('../save_load_image.php');

    $params = validate(['id', 'datetime', 'subject', 'body', 'imageData?']);

    onlyAdmin($params);

    $id = intval($params['id']);
    
    query("
        INSERT INTO news
        (
            id,
            users_id,
            dt,
            subject,
            body
        )
        VALUES
        (
            $id,
            " . $params['user']['id'] . ",
            '" . escape($params['datetime']) . "',
            '" . escape($params['subject']) . "',
            '" . escape($params['body']) . "'
        )
        ON DUPLICATE KEY UPDATE
            users_id = " . $params['user']['id'] . ",
            dt = '" . escape($params['datetime']) . "',
            subject = '" . escape($params['subject']) . "',
            body = '" . escape($params['body']) . "'
    ");

    if (!$id) {
        $id = insert_id();
    }

    if ($params['imageData']) {
        $e = "";
        if ($pics_ext = saveBase64Image($params['imageData'], "../../pics/news", $id, $e)) {
            query("insert into pics (target, id, ext) values ('news', $id, '$pics_ext') ON DUPLICATE KEY UPDATE ext = '$pics_ext'");
        } else {
            exit(json_encode(['success' => false, 'error' => $e]));
        }
    } else {
        query("delete from pics where id = $id");
    }

    exit(json_encode(['success' => true]));
