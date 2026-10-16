<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    assert($db);

    $_POST = json_decode(file_get_contents('php://input'), true);
    $books_id = intval($_POST['books_id']);
    $inbox_id = (intval($_POST['inbox_id']) ? intval($_POST['inbox_id']) : 'NULL');
    $states_id = (intval($_POST['inbox_id']) ? 6 : 1);

    ($q = mysqli_query($db, "select * from books2inbox where books_id = $books_id")) || exit(mysqli_error($db));
    if ($row = mysqli_fetch_assoc($q)) {
        mysqli_query($db, "update books2inbox set states_id = $states_id, inbox_id = $inbox_id, added_by_user = 1  where books_id = $books_id") || exit(mysqli_error($db));
    } else {
        mysqli_query($db, "insert into books2inbox (books_id, states_id, inbox_id, added_by_user) values ($books_id, $states_id, $inbox_id, 1)") || exit(mysqli_error($db));
    }
    mysqli_query($db, "insert into states_log (books_id, dt, states_id) values ($books_id, NOW(), $states_id)");
    exit(json_encode(['status'=>'success']));