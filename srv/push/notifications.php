<?php
	require_once('send_functions.php');
//    require_once('send_functions.php');
//    send('test', 'some body', ['__KP_FCM_DEVICE_TOKEN__']);
//	$db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');

	$db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
    ($q = mysqli_query($db, "
        select n.id notifications_id, bv.id books_id
        from notifications n
        join books_view bv on n.books_id = bv.id
        where
            n.process_start is null and
            date_add(bv.is_readable_from, interval 9 hour) <= now()
    ")) || exit(1);

    if ($row = mysqli_fetch_assoc($q)) {
        echo "Send notification #$row[notifications_id] for book #$row[books_id]...";
        //echo escapeshellarg(json_encode($row)) . "\n"; exit;
        exec("/usr/bin/php8.4 sendit.php " . escapeshellarg(json_encode($row)), $out, $ec);
        if ($ec) exit("failed ($ec)!\n");
        
        $json = json_decode(implode("\n", $out));
        var_dump($json);
    }