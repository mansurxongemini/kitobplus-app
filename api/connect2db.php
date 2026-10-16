<?php
        require_once 'access/click.php';

        if (!isset($NOHEADER) || !$NOHEADER) {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
                header('Access-Control-Max-Age: 86400');
                header('Content-Type: application/json; charset=utf-8');
                
                // Обработка preflight запросов
                if (($_SERVER['REQUEST_METHOD'] ?? FALSE)=== 'OPTIONS') {
                        http_response_code(200);
                        exit();
                }
        }

        $DB = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
        assert($DB);
        $DB->set_charset('utf8mb4');

/*
        if (!mysqli_query ($db, "set character_set_client='utf8'"))exit(mysqli_error($db));
        mysqli_query ($db, "set character_set_results='utf8'");
        mysqli_query ($db, "set collation_connection='utf8_general_ci'");
*/
        $LAST_QUERY = FALSE;

        function query($_query) {
                global $DB, $LAST_QUERY;
                if (!($q = $DB->query($_query))) {
                        error_log($DB->error);
                        exit(json_encode(['success' => false, 'error' => 'Internal error (query: ' . $_query . ', error: ' . $DB->error . ')']));
                }
                $LAST_QUERY = $q;
                return $q;
        }

        function insert_id() {
                global $DB;
                return $DB->insert_id;
        }

        function escape($_t) {
                global $DB;
                return $DB->real_escape_string($_t);
        }

        function fetch($q = FALSE) {
		global $LAST_QUERY;
                return ($q ? $q : $LAST_QUERY)->fetch_assoc();
        }

        function fetch_all($q = FALSE) {
		global $LAST_QUERY;
                $query = $LAST_QUERY;
                if ($q) {
                        $query = (is_string($q) ? query($q) : $q);
                }

                $result = [];
                while ($row = $query->fetch_assoc()) {
                        $result[] = $row;
                }
                return $result;
        }

        function fetch_row($_query) {
                return fetch(query($_query));
        }

        function pushUp($invoice) {
                query("update invoices set payed = 1 where id = $invoice[id]");
                query("update users set plans_id = 3, plan_end = date_add(if(plan_end is null, now(), if(plan_end > now(), plan_end, now())), INTERVAL $invoice[months] MONTH) where id = $invoice[users_id]");
        }

        function verifyInvoices(&$user) {
                $invoices = fetch_all("
                        select
                                invoices.*,
                                date_format(invoices.dt, '%Y-%m-%d') dt_str,
                                if(invoices.dt < date_sub(NOW(), INTERVAL 1 DAY), 1, 0) archive,
                                if(invoices.dt > date_sub(NOW(), INTERVAL 5 MINUTE), 1, 0) fresh
                        from invoices
                        where users_id = $user[id] and /*click_id is not null and */ payed = 0 and cancelled = 0 and error is null");
                $userUpdated = false;
                $hasUnpayedInvoice = false;
                $amount = false;
                foreach ($invoices as $invoice) {
                        //if ($invoice['click_id'] != 171171075) continue;

                        $response = invoiceStatus($invoice['click_id']);
                        if (!$response['success']) continue;
        
                        $status = $response['response'];
                        //$user['invoiceStatus'] = $status;
                        if (($status['payment_status'] ?? 0) == 2) {
                                pushUp($invoice);
                                $userUpdated = true;
                                continue;
                        }

                        $response = paymentStatus(sprintf("kp%06d", $invoice['id']), $invoice['dt_str']);
                        //$user['paymentStatus'] = $response['response'];

                        if (!$response['success']) continue;

                        $status = $response['response'];

                        //$status = ['payment_status' => 2];
                          
                        if (($status['payment_status'] ?? 0) == 2) {
                                pushUp($invoice);
                                $userUpdated = true;
                                continue;
                        }

                        if ($invoice['archive']) {
                                query("update invoices set cancelled = 1 where id = $invoice[id]");
                                continue;
                        }

                        if ($status['error_code'] && $status['error_code'] != -16) {
                                query("update invoices set error = '" . escape($status['error_note'] ? $status['error_note'] : "Ошибка $status[error_code]") . "' where id = $invoice[id]");
                                continue;
                        }

                        if ($invoice['fresh']) {
                                $hasUnpayedInvoice = $invoice['click_id'];
                                $amount = $invoice['amount'];
                        }
                }
                
                if ($userUpdated) {
                        $user = getUser($user['id']);
                        return;
                }

                if ($hasUnpayedInvoice) {
                        global $service_id, $merchant_id;
                        $user['hasUnpayedInvoice'] = $hasUnpayedInvoice;
                        $user['service_id'] = $service_id;
                        $user['merchant_id'] = $merchant_id;
                        $user['service_id'] = $service_id;
                        $user['amount'] = $amount;
                        $user['transaction_param'] = $user['name'];
                }
        }

        function validateAnon($fields) {
                return validate($fields, FALSE, FALSE, FALSE);
        }

        function onlyAdmin($params) {
                if ($params['user']['state'] != 2 || $params['user']['levels_id'] != 0) {
                        exit(json_encode(['success' => false, 'error' => 'Access denied', 'user' => $params['user']]));
                }
        }

        function validate($fields, $json = FALSE, $use_token = TRUE, $use_user = TRUE, $service = FALSE) {
		$body = file_get_contents('php://input');

                if ($json === FALSE) {
                        if (!($json = json_decode($body, true))) {
                                if (is_array($_GET)) {
                                        $json = $_GET;
                                } else {
                                        exit(json_encode(['success' => false, 'error' => 'Incorrect requets']));
                                }
                        }
                }

                if (!is_array($fields)) $fields = [$fields];

                $headers = getallheaders();
                if (array_key_exists('Authorization', $headers) && preg_match('/^Bearer (\d{19})$/', $headers['Authorization'], $m)) {    
                        $json['token'] = $m[1];
                }

                foreach (['platform', 'model', 'token'] as $_) {
                        if (!array_key_exists($_, $fields)) {
                                $fields[] = $_;
                        }

                        if (array_key_exists($_, $headers)) {    
                                $json[$_] = ($_ == 'platform' ? intval($headers[$_]) : $headers[$_]);
                        }
                }

                $params = [];

                foreach ($fields as $field) {
                        $optional = false;
                        if (preg_match('/^(.+)\?$/', $field, $m)) {
                                $optional = true;
                                $field = $m[1];
                        }

                        if (is_array($_GET) && array_key_exists($field, $_GET) && !array_key_exists($field, $json)) {
                                $json[$field] = $_GET[$field];
                        }

                        if (!array_key_exists($field, $json) && !$service) {
                                if ($optional) {
                                        $params[$field] = NULL;
                                } else {
                                        exit(json_encode(['success' => false, 'error' => "Incorrect requets (param $field missing)"]));
                                }
                        } elseif (array_key_exists($field, $json)) {
	                        $params[$field] = $json[$field];
                        } else {
                                // Service mode: поле отсутствует, устанавливаем NULL
                                $params[$field] = NULL;
                        }
                };

                if (!$service && (!preg_match('/^\d+$/', $params['platform']) || !$params['model'])) {
                        exit(json_encode(['success' => false, 'error' => 'Incorrect api params']));
                }

                if (!$use_token && $params['token'] == 'null') {
                        $params['token'] = NULL;
                } elseif (!preg_match('/^\d' . ($use_token ? '+' : '*') . '$/', $params['token'])) {
                        exit(json_encode(['success' => false, 'error' => 'Incorrect token']));
                }

                $params['user'] = FALSE;

                if ($use_token || preg_match('/^\d+$/', $params['token'])) {
                        $params['user'] = query("
                                select u.*,
                                        count(distinct bh.books_id) listened_books_count,
                                        p.name plans_name,
                                        if (plan_end is null or plan_end < now(), '', date_format(u.plan_end, '%d.%m.%Y')) plan_end_str,
                                        if (plans_id = 2 or (plan_end is not null and plan_end > now()), 1, 0) plan_active,
                                        date(date_add(if(plan_end is null, now(), if(plan_end > now(), plan_end, now())), INTERVAL 1 MONTH)) plan_pushup_end,
                                        if (plans_id != 2 and (plans_id = 1 or (plan_end is not null and date_add(now(), INTERVAL 3 DAY) >= plan_end)), 1, 0) can_top_up,
                                        t2.fcm fcm_token
                                from tokens2 t2
                                join users u on t2.users_id = u.id and u.deleted is null
                                        left join bookshelfs_history bh on u.id = bh.users_id and bh.is_add
                                        left join plans p on u.plans_id = p.id
                                where
                                        t2.token = $params[token]
                                        and t2.platform = $params[platform]
                                        and t2.model = '" . escape($params['model']) . "'
                                        and t2.dt > date_sub(NOW(), INTERVAL 365 DAY)
				group by u.id
                        ")->fetch_assoc();
						//var_dump($params['user']);

                        if (!$params['user'] && $use_user) {
                                exit(json_encode(['success' => false, 'error' => "Incorrect session token", 'token' => NULL]));
                        }

                        if ($params['user']) {
                                $params['user']['id'] = intval($params['user']['id']);
                                $params['user']['state'] = intval($params['user']['state']);
                                $params['user']['gender'] = intval($params['user']['gender']);
//                                $params['user']['readers_club'] = intval($params['user']['readers_club']);
                                $params['user']['plans_id'] = intval($params['user']['plans_id']);
                                $params['user']['plan_active'] = intval($params['user']['plan_active']);
                                $params['user']['can_top_up'] = intval($params['user']['can_top_up']);
                                if (!$params['user']['plan_active']) {
                                        $params['user']['plans_id'] = 0;
                                        $params['user']['plans_name'] = 'Ограниченный доступ';
                                } else {
                                        $params['user']['state'] = 2;
                                }

                                $params['user']['notification'] = intval($params['user']['notification']);

                                $params['user']['available_payments'] = ($params['user']['can_top_up'] ? getPremiumPlans() : []);
                                $params['user']['disability'] = is_null($params['user']['disability']) ? NULL : intval($params['user']['disability']);
                                $params['user']['registration_state'] = $params['user']['state'];

                                if (!is_null($params['user']['disability'])) {
                                        //$params['user']['state'] = 2;
                                }

                                if ($params['user']['state'] == 2 && !$params['user']['decode_key']) {
                                        $params['user']['decode_key'] = genDecodeKey($params['user']['id']);
                                }

                                verifyInvoices($params['user']);

                                //unset($params['user']['decode_key']);
                        }
                }

                $params['ip'] = "INET_ATON('" . $_SERVER['REMOTE_ADDR'] . "')";

                return $params;
        }


        function genToken() {
                //18446744073709551615
                //9223372036854775807

/*
                $max = 1000000000000000000;
                $min = 9999999999999999999;
                $max_high = ceil($max >> 32);
                $min_high = ceil($min >> 32);

                return (rand($min_high, $max_high) << 32) | rand(0x0, 0x7FFFFFFF);
*/
                $result = rand(1, 9);
                for ($i = 0; $i < 18; $i++) {
                        $result .= rand(0, 9);
                }

                return $result;
        }


        function getUser($id) {
                if ($user = query("
					select u.*,
                                                count(distinct bh.books_id) listened_books_count,
                                                p.name plans_name,
                                                if (plan_end is null or plan_end < now(), '', date_format(u.plan_end, '%d.%m.%Y')) plan_end_str,
                                                if (plans_id = 2 or (plan_end is not null and plan_end > now()), 1, 0) plan_active,
                                                date(date_add(if(plan_end is null, now(), if(plan_end > now(), plan_end, now())), INTERVAL 1 MONTH)) plan_pushup_end,
                                                if (plans_id != 2 and (plans_id = 1 or (plan_end is not null and date_add(now(), INTERVAL 3 DAY) >= plan_end)), 1, 0) can_top_up,
                                                t2.fcm fcm_token
					from users u
					left join bookshelfs_history bh on u.id = bh.users_id and bh.is_add
                                        left join plans p on u.plans_id = p.id
                                        left join tokens2 t2 on u.id = t2.users_id
					where u.id = " . intval($id) . " and deleted is null
                                        group by u.id
				")->fetch_assoc()) {
                        $user['id'] = intval($user['id']);
                        $user['state'] = intval($user['state']);
                        $user['gender'] = intval($user['gender']);
                        $user['registration_state'] = $user['state'];
                        $user['plans_id'] = intval($user['plans_id']);
                        $user['plan_active'] = intval($user['plan_active']);
                        $user['can_top_up'] = intval($user['can_top_up']);
                        if (!$user['plan_active']) {
                                $user['plans_id'] = 0;
                                $user['plans_name'] = 'Ограниченный доступ';
                        } else {
                                $user['state'] = 2;
                        }
                        
                        $user['notification'] = intval($user['notification']);

                        $user['available_payments'] = ($user['can_top_up'] ? getPremiumPlans() : []);
                        $user['disability'] = (is_null($user['disability']) ? NULL : intval($user['disability']));
                        $user['readers_club'] = (is_null($user['readers_club']) ? NULL : intval($user['readers_club']));

                        if (!is_null($user['disability'])) {
                                //$user['state'] = 2;
                        }

                        if ($user['state'] == 2 && !$user['decode_key']) {
                                $user['decode_key'] = genDecodeKey($user['id']);
                        }
                        //unset($user['decode_key']);
                        return $user;
                }

                exit(json_encode(['success' => false, 'error' => 'Internal error :(']));
        }

        function getPremiumPlans($_all = false) {
                $plans = fetch_all("select * from premium_plans " . ($_all ? "" : "where enabled = 1") . " order by id");
                $plans = array_map(function($_) {
                        return [
                        'id' => intval($_['id']),
                        'amount' => intval($_['amount']),
                        'enabled' => intval($_['enabled']),
                        'price' => intval($_['price']),
                        'name' => $_['name']
                        ];
                }, $plans);

                return $plans;
        }
        function genDecodeKey($uid) {
                $used = array_fill(0, 256, false);
                $key = [];
                for ($i = 0; $i < 256; $i++) {
                        do {
                                $_ = rand(0, 255);
                        } while ($used[$_]);
                        $key[] = $_;
                        $used[$_] = true;                        
                }
                $jk = json_encode($key);
                query("update users set decode_key = '" . escape($jk) . "' where id = $uid");
                return $jk;
        }

        function issueToken($users_id, $platform, $model, $fcm_token) {
                query("delete from tokens2 where users_id = $users_id and platform = $platform");
                do {
                        $token = genToken();
                } while (query("select * from tokens2 where token = $token")->fetch_assoc());

                if ($fcm_token) {
                        query("update tokens2 set fcm = null where fcm = '" . escape($fcm_token) . "'");
                }

                query("insert into tokens2 (token, users_id, platform, model, dt, fcm) values ($token, $users_id, $platform, '" . escape($model) . "', NOW(), " . ($fcm_token ? "'" . escape($fcm_token) . "'" : "NULL") . ")");
                
                return $token;
        }

        function signin($provider, $provider_id, $email, $name) {
                error_log("signin() called: provider=$provider, provider_id=$provider_id, email=$email, name=$name");

                if ($row = fetch_row("select * from signins where provider = '" . escape($provider) . "' and provider_id = '" . escape($provider_id) . "'")) {
                        error_log("Existing signin found, users_id=" . $row['users_id']);
                        return getUser($row['users_id']);
                }

                error_log("No existing signin found, checking for user with same email");

                // Проверяем, есть ли пользователь с таким email (может быть зарегистрирован через SMS)
                if (trim($email) && ($row = fetch_row("select * from users where email = '" . escape($email) . "'"))) {
                        $users_id = $row['id'];
                        error_log("Found existing user with email $email, users_id=" . $users_id);

                        // Если у существующего пользователя нет имени, обновляем его
                        if (empty($row['name']) && !empty($name)) {
                                error_log("Updating user name from empty to: " . $name);
                                query("update users set name = '" . escape($name) . "' where id = " . $users_id);
                        }
                } else {
                        $insert_query = "insert into users (name, register_date, email, levels_id, plans_id, plan_end) values ('" . escape($name) . "', NOW(), '" . escape($email) . "', 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY))";
                        error_log("Creating new user: " . $insert_query);
                        query($insert_query);
                        $users_id = insert_id();
                        error_log("New user created with id=" . $users_id);
                }

                $signin_query = "insert into signins (provider, provider_id, email, name, users_id) values ('" . escape($provider) . "', '" . escape($provider_id) . "', '" . escape($email) . "', '" . escape($name) . "', $users_id)";
                error_log("Creating signin record: " . $signin_query);
                query($signin_query);

                return getUser($users_id);
        }
