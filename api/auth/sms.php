<?php
    require_once('../connect2db.php');
    require_once('sendSMS.php');
    require_once('../env.php');

    $params = validateAnon('phone');
    $phone = "'" . escape($params['phone']) . "'";

    $last = query("select * from sms where phone = $phone and sended >= date_sub(now(), interval 30 second)");
    if (fetch()) {
        exit(json_encode(['success' => false, 'error' => 'Please wait some time...']));
    }

    query("delete from sms where sended < date_sub(now(), interval 300 second)");

    $last = query("select * from sms where phone = $phone");
    $used = [];
    while ($row = fetch()) {
        $used[] = $row['code'];
    }

    do {
        $code = rand(1000, 9999);
    } while (in_array($code, $used));

    $clean_phone = preg_replace('/[^0-9]/', '', $phone);

	// Номер для проверки приложений в App Store и Google Play: постоянный код, только точное совпадение.
	if ($clean_phone === '__KP_FIXED_CODE_PHONE__') {
		$code = '__KP_FIXED_CODE__';
	}

	// Тестовые номера: SMS не отправляется, код возвращается в ответе. Только local/staging и только точное
	// совпадение номера. Раньше проверялось окончание номера (/2004333$/ и т.п.) и в production, из-за чего
	// любой номер с таким окончанием входил без SMS.
	$test_phones = [
		'__KP_TEST_PHONE_1__', '__KP_TEST_PHONE_2__', '__KP_TEST_PHONE_3__',
		'__KP_TEST_PHONE_4__', '__KP_TEST_PHONE_5__', '__KP_TEST_PHONE_7__',
	];
	if (kp_env() === 'local') {
		$test_phones[] = '998902004333';
	}
	$is_test_phone = !kp_is_production() && in_array($clean_phone, $test_phones, true);

	if (!$is_test_phone && !sendSMS($clean_phone, "KitobPlus kutubxonasidan ro'yhatdan o'tish uchun tasdiqlash kodi / Kod podtverjdeniya dlya registracii na biblioteke kitobplus: $code")) {
		exit(json_encode(['success' => false, 'error' => 'Error while send SMS to phone +' . $clean_phone]));
	}

    query("insert into sms (phone, code, sended, ip) values ($phone, $code, NOW(), $params[ip])");

    $response = ['success' => true];

    if ($is_test_phone) {
        $response['code'] = $code;
    }

    exit(json_encode($response));
