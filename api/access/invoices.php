<?php

	require_once('../connect2db.php');

	$params = validate([]);
	onlyAdmin($params);

	$data = fetch_all("select i.*, u.name users_name from invoices i join users u on i.users_id = u.id order by i.dt");

	exit(json_encode([
		'success' => true,
		'data' => $data
	]));
