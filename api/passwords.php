<?php
	// Проверка паролей пользователей.
	// Раньше пароли хранились и сравнивались открытым текстом. Теперь хранится password_hash();
	// старый открытый пароль принимается один раз и сразу заменяется хешем (переход без сброса паролей).

	function kp_password_matches($stored, $given) {
		if (!is_string($stored) || $stored === '' || !is_string($given) || $given === '') {
			return false;
		}
		if (password_get_info($stored)['algo']) {
			return password_verify($given, $stored);
		}
		return hash_equals($stored, $given);
	}

	// Заменить открытый пароль хешем после успешного входа. Хеш длиннее 60 символов:
	// если столбец короче, хеш обрезался бы и пользователь потерял бы доступ, поэтому тогда ничего не меняем.
	function kp_password_upgrade($db, $users_id, $stored, $given) {
		if (password_get_info($stored)['algo'] && !password_needs_rehash($stored, PASSWORD_DEFAULT)) {
			return;
		}
		$res = $db->query("select CHARACTER_MAXIMUM_LENGTH len from information_schema.COLUMNS
			where TABLE_SCHEMA = database() and TABLE_NAME = 'users' and COLUMN_NAME = 'password'");
		$row = $res ? $res->fetch_assoc() : null;
		if (!$row || intval($row['len']) < 255) {
			error_log('kp_password_upgrade: users.password shorter than 255, password left unhashed');
			return;
		}
		$hash = password_hash($given, PASSWORD_DEFAULT);
		$stmt = $db->prepare('update users set password = ? where id = ?');
		$id = intval($users_id);
		$stmt->bind_param('si', $hash, $id);
		$stmt->execute();
	}
