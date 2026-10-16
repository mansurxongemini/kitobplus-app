<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
    //exit(json_encode(['a'=>'b', 'num'=>123]));

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    //$db = mysqli_select_db('mybook',$db_serv);
    assert($db);

    $_POST = json_decode(file_get_contents('php://input'), true);
    $books_id = intval($_POST['books_id']);
    $states_id = (intval($_POST['states_id']) ? intval($_POST['states_id']) : 'NULL');
    ($q = mysqli_query($db, "select * from books2inbox where books_id = $books_id")) || exit(mysqli_error($db));
    if ($row = mysqli_fetch_assoc($q)) {
        mysqli_query($db, "update books2inbox set states_id = $states_id where books_id = $books_id") || exit(mysqli_error($db));
    } else {
        mysqli_query($db, "insert into books2inbox (books_id, states_id) values ($books_id, $states_id)") || exit(mysqli_error($db));
    }
    mysqli_query($db, "insert into states_log (books_id, dt, states_id) values ($books_id, NOW(), $states_id)");
    exit(json_encode(['status'=>'success']));