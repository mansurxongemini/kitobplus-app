<?php
	require_once('save_image.php');

	$e = "";
	$res = saveBase64Image(trim(file_get_contents('test.base64')), 'tst', 123, $e);
	var_dump($res);
