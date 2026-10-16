<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    $request = json_decode(file_get_contents('php://input'), true);

    if (!is_array($request) || !array_key_exists('email', $request) || !array_key_exists('password', $request)) {
        exit(json_encode(['success' => false, 'error' => 'Неверный запрос']));
    }

	require_once(__DIR__ . '/../api/passwords.php');

	// Вход в админку по таблице users: только сотрудники (levels_id = 0, как в onlyAdmin()) и не удалённые.
	// Раньше подходил любой пользователь сайта с email и паролем и получал токен администратора.
	function kp_admin_password_ok($db, $email, $password) {
		if (!is_string($email) || trim($email) === '') return false;
		$stmt = $db->prepare('select id, password from users where email = ? and levels_id = 0 and deleted is null limit 1');
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$row = $stmt->get_result()->fetch_assoc();
		if (!$row || !kp_password_matches($row['password'], $password)) return false;
		kp_password_upgrade($db, $row['id'], $row['password'], $password);
		return true;
	}

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
    
    if (
        ($request['email'] == '__KP_ADMIN_LOGIN_1__' && $request['password'] == '__KP_ADMIN_PASSWORD_1__') ||
        ($request['email'] == '__KP_ADMIN_LOGIN_2__' && $request['password'] == '__KP_ADMIN_PASSWORD_2__') ||
        kp_admin_password_ok($db, $request['email'], $request['password'])
    ) {
        exit(json_encode(['success' => true, 'token' => '__KP_ADMIN_TOKEN__', 'user' => ['users_levels_id' => 1]]));    
    }
    exit(json_encode(['success' => false, 'error' => 'Неверные учётные данные']));
    