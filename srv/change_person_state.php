<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
    //exit(json_encode(['a'=>'b', 'num'=>123]));

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    //$db = mysqli_select_db('mybook',$db_serv);
    assert($db);

    $_POST = json_decode(file_get_contents('php://input'), true);

    $table = mysqli_real_escape_string($db, $_POST['table']);
    $id = intval($_POST['id']);
    $states_id = (intval($_POST['states_id']) ? intval($_POST['states_id']) : 'NULL');
    //mysqli_query($db, "update " . mysqli_real_escape_string($db, $_POST['table']) . " set states_id = $states_id where id = " . intval($_POST['id'])) || exit(mysqli_error($db));

    ($q = mysqli_query($db, "select * from ${table}_states where ${table}_id = $id")) || exit(mysqli_error($db));
    if ($row = mysqli_fetch_assoc($q)) {
        mysqli_query($db, "update ${table}_states set states_id = $states_id where ${table}_id = $id") || exit(mysqli_error($db));
    } else {
        mysqli_query($db, "insert into ${table}_states (${table}_id, states_id) values ($id, $states_id)") || exit(mysqli_error($db));
    }
    exit(json_encode(['status'=>'success']));