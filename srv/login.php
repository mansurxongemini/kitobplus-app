<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    $request = json_decode(file_get_contents('php://input'), true);

    if (!is_array($request) || !array_key_exists('email', $request) || !array_key_exists('password', $request)) {
        exit(json_encode(['success' => false, 'error' => 'Неверный запрос']));
    }

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
    
    if (
        ($request['email'] == '__KP_ADMIN_LOGIN_1__' && $request['password'] == '__KP_ADMIN_PASSWORD_1__') ||
        ($request['email'] == '__KP_ADMIN_LOGIN_2__' && $request['password'] == '__KP_ADMIN_PASSWORD_2__') ||
        ($db->query("select * from users where email = '" . $db->escape_string($request['email']) . "' and password = '" . $db->escape_string($request['password']) . "'"))->fetch_assoc()
    ) {
        exit(json_encode(['success' => true, 'token' => '__KP_ADMIN_TOKEN__', 'user' => ['users_levels_id' => 1]]));    
    }
    exit(json_encode(['success' => false, 'error' => 'Неверные учётные данные']));
    