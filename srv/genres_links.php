<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

    $db = mysqli_connect('__KP_MYBOOK_HOST__', 'mybook', '__KP_MYBOOK_PASSWORD__', 'mybook');
    assert($db);

    ($q = mysqli_query($db, "select b2i.inbox_id inbox_id, group_concat(distinct gl.inbox_id) genres from books2inbox b2i join books2genres b2g on b2i.books_id = b2g.books_id join genres_link gl on b2g.genres_id = gl.mybook_id group by b2i.inbox_id")) || exit(mysqli_error($db));
    $ressult = [];
    while ($row = mysqli_fetch_assoc($q)) {
        $result[] = $row;
    }

    exit(json_encode($result));
