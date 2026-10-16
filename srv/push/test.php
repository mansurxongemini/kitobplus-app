<?php
	require_once('send_functions.php');
//    require_once('send_functions.php');
//    send('test', 'some body', ['__KP_FCM_DEVICE_TOKEN__']);
//	$db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');


	$result = send(
		"test",
		"New book :)",
		[
			//"__KP_FCM_DEVICE_TOKEN__",
			//"__KP_FCM_DEVICE_TOKEN__",
			"__KP_FCM_DEVICE_TOKEN__"
		],
		1314
	);

	var_dump($result); exit;

	foreach ($result[2] as $item) {
		//echo $item->getToken() . "\n";
		$message = json_decode(json_encode($item->message()), 1);
		echo $message['token'] . "\n";
	}