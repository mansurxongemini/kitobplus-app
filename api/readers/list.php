<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('../connect2db.php');

        $params = validate(['sort', 'filter']);

		$sorts = [
			'listened_books_count desc', 'register_date', 'nickname'
		];

		$filter = '';
		if (array_key_exists('filter', $params)) {
			$filter = trim($params['filter']);
		}

        $readers = fetch_all("
			select id, name, nickname, gender, register_date, listened_books_count, avatar_id
			from users_view
			where readers_club = 1 and nickname != '' and nickname is not null and listened_books_count >= 10 " . ($filter ? " and nickname like '" . escape($filter) . "%'" : "") . "
			order by " . $sorts[intval($params['sort'])] . "
		");

        exit(json_encode(['success' => true, 'readers' => $readers]));
