<?php
    require_once('../connect2db.php');

    $params = validateAnon(['phone', 'code', 'disability?', 'fcm_token?']);

    $phone = "'" . escape($params['phone']) . "'";
    $code = intval($params['code']);

    query("delete from sms where sended < date_sub(now(), interval 300 second)");

    $last = query("select * from sms where phone = $phone and code = $code and ip = $params[ip]");
    if (!fetch()) {
        exit(json_encode(['success' => false, 'error' => 'Введён неверный код', 'query' => "select * from sms where phone = $phone and code = $code and ip = $params[ip]"]));
    }

    $old_token = ($params['token'] ?? FALSE);
    $existing_oauth_user_id = null;

    // Проверяем, есть ли активный OAuth аккаунт с этим токеном
    if (preg_match("/^\d{19}$/", $old_token)) {
        if ($oauth_row = fetch_row("select users_id from tokens2 where token = $old_token")) {
            $existing_oauth_user_id = $oauth_row['users_id'];
            error_log("Found existing OAuth user with token $old_token, users_id=$existing_oauth_user_id");
        }
    }

    // Проверяем, есть ли пользователь с этим телефоном
    query("select id, disability from users where phone = $phone and deleted is null");
    if (!($row = fetch())) {
        // Пользователя с таким телефоном нет
        if ($existing_oauth_user_id) {
            // Есть OAuth аккаунт - добавляем телефон к нему
            error_log("Adding phone to existing OAuth user $existing_oauth_user_id");
            $disability = is_null($params['disability']) ? "NULL" : intval($params['disability']);
            query("update users set phone = $phone, state = 0" .
                  (!is_null($params['disability']) ? ", disability = $disability" : "") .
                  " where id = $existing_oauth_user_id");
            $users_id = $existing_oauth_user_id;
        } else {
            // Нет ни OAuth аккаунта, ни телефона - создаем нового пользователя
            error_log("Creating new user with phone $phone");
            $disability = is_null($params['disability']) ? "NULL" : intval($params['disability']);
            query("insert into users (phone, state, disability, plans_id, plan_end) values ($phone, 0, $disability, 1, DATE_ADD(NOW(), INTERVAL 7 DAY))");
            $users_id = insert_id();
        }
    } else {
        // Пользователь с таким телефоном уже существует
        $users_id = $row['id'];
        error_log("Found existing user with phone $phone, users_id=$users_id");

        if (!is_null($params['disability'])) {
            if ($row['disability'] != intval($params['disability'])) {
                query("update users set disability = " . intval($params['disability']) . " where id = $users_id");
            }
        }

        // Если это был OAuth аккаунт (другой), объединяем их
        if ($existing_oauth_user_id && $existing_oauth_user_id != $users_id) {
            error_log("Merging OAuth user $existing_oauth_user_id into phone user $users_id");
            // Переносим все OAuth signins на аккаунт с телефоном
            query("update signins set users_id = $users_id where users_id = $existing_oauth_user_id");
            // Удаляем старый OAuth аккаунт
            query("update users set deleted = NOW() where id = $existing_oauth_user_id");
        }
    }

    $user = getUser($users_id);
    $token = issueToken($user['id'], $params['platform'], $params['model'], $params['fcm_token'] ?? '');

    exit(json_encode(['success' => true, 'token' => $token, 'user' => $user]));
