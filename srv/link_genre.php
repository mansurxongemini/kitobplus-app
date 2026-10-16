<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    assert($db);

    $_POST = json_decode(file_get_contents('php://input'), true);
    $mybook_id = intval($_POST['mybook_genres_id']);
    $inbox_ids = array_filter(array_map("intval", $_POST['inbox_genres']));
    console.log
    ($q = mysqli_query($db, "select * from genres_link where mybook_id = $mybook_id")) || exit(mysqli_error($db));
    $sql = [];
    while ($row = mysqli_fetch_assoc($q)) {
        $sql[] = intval($row['inbox_id']);
    }
//    var_dump($sql);
    $to_delete = array_diff($sql, $inbox_ids);
    $to_insert = array_diff($inbox_ids, $sql);
//    var_dump($to_delete);

    if (count($to_delete)) {
        if (!mysqli_query($db, "delete from genres_link where mybook_id = $mybook_id and inbox_id in (" . implode(", ", $to_delete) . ")")) {
            exit(json_encode(['status' => 'error', 'message' => mysqli_error($db)]));
        }
    }

    if (count($to_insert)) {
        if (!mysqli_query($db, "insert into genres_link (mybook_id, inbox_id) values ($mybook_id, " . implode("), ($mybook_id, ", $to_insert) . ")")) {
            exit(json_encode(['status' => 'error', 'message' => mysqli_error($db)]));
        }
    }

    exit(json_encode(['status'=>'success']));