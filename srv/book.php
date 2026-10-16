<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
    //exit(json_encode(['a'=>'b', 'num'=>123]));

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    //$db = mysqli_select_db('mybook',$db_serv);
    assert($db);

    $id = intval($_GET['id']);
    assert($id);

	($q = mysqli_query($db, "select * from books where id = $id")) || exit(mysqli_error($db));
    $row = mysqli_fetch_assoc($q);
	assert($row);

	$book = null;

	if (file_exists("/mnt/240g/av3715.ru/mybook/books/$id.json")) {
		$book = json_decode(file_get_contents("/mnt/240g/av3715.ru/mybook/books/$id.json"), true);
	}

//	exec("stat /mnt/240g/av3715.ru/mybook/books/new/$id.json 2>&1", $out);
//	var_dump($out);
//	exit;

	if (!$book && file_exists("/mnt/240g/av3715.ru/mybook/new/books/$id.json")) {
		$book = json_decode(file_get_contents("/mnt/240g/av3715.ru/mybook/new/books/$id.json"), true);
	}

	assert($book);

    exit(json_encode($book));
