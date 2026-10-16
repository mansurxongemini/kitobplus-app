<?php
	header('Access-Control-Allow-Origin: *');

	$db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
	//$db = mysqli_select_db('mybook',$db_serv);
	assert($db);

	if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");

	($q = mysqli_query($db, "select inbox_id, adult
                             from books b
                             join books2inbox b2i on b2i.books_id = b.id
                             where b2i.inbox_id is not null and b.adult is not null")) || exit(mysqli_error($db));
	$res = [];

	while ($row = mysqli_fetch_assoc($q)) {
		$res[$row['inbox_id']] = $row['adult'];
	}


	exit(json_encode($res, JSON_PRETTY_PRINT));
