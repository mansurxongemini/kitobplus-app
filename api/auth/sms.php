<?php
    require_once('../connect2db.php');
    require_once('sendSMS.php');

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

	if ($clean_phone == '__KP_FIXED_CODE_PHONE__') {
		$code = '__KP_FIXED_CODE__';
	}

//    if (!preg_match('/0000$/', $clean_phone) && !preg_match('/4333$/', $clean_phone) && !sendSMS($clean_phone, "Tasdiqlash kodi $code")) {
//    if (!preg_match('/0000$/', $clean_phone) && !preg_match('/4333$/', $clean_phone) && !sendSMS($clean_phone, "Kitob Plus kutubxonasidan\nRo'yxatdan o'tish uchun tasdiqlash kodi / Kod podtverjdeniya dlya registracii v biblioteke Kitob Plus: $code")) {
//    if (!preg_match('/0000$/', $clean_phone) && !preg_match('/4333$/', $clean_phone) && !sendSMS($clean_phone, "Kitob Plus kutubxonasidan\nRo'yxatdan o'tish uchun tasdiqlash kodi: $code")) {
    if (
		/*!preg_match('/0000$/', $clean_phone) &&*/
		!preg_match('/2004333$/', $clean_phone) &&
		!preg_match('/998977087331$/', $clean_phone) &&
        !preg_match('/__KP_TEST_PHONE_3__$/', $clean_phone) &&
        !preg_match('/__KP_TEST_PHONE_4__$/', $clean_phone) &&
        !preg_match('/__KP_TEST_PHONE_1__$/', $clean_phone) &&
        !preg_match('/__KP_TEST_PHONE_5__$/', $clean_phone) &&
        !preg_match('/__KP_TEST_PHONE_2__$/', $clean_phone) &&
		!sendSMS($clean_phone, "KitobPlus kutubxonasidan ro'yhatdan o'tish uchun tasdiqlash kodi / Kod podtverjdeniya dlya registracii na biblioteke kitobplus: $code")
	) {
        exit(json_encode(['success' => false, 'error' => 'Error while send SMS to phone +' . $clean_phone]));
    }

    query("insert into sms (phone, code, sended, ip) values ($phone, $code, NOW(), $params[ip])");

    $response = ['success' => true];

    if (/*preg_match('/0000$/', $clean_phone) || */
		preg_match('/2004333$/', $clean_phone) ||
		preg_match('/998977087331$/', $clean_phone) ||
		preg_match('/__KP_TEST_PHONE_3__$/', $clean_phone) ||
		preg_match('/__KP_TEST_PHONE_4__$/', $clean_phone) ||
        preg_match('/__KP_TEST_PHONE_1__$/', $clean_phone) ||
        preg_match('/__KP_TEST_PHONE_1__$/', $clean_phone) ||
        preg_match('/__KP_TEST_PHONE_2__$/', $clean_phone)
	) {
        $response['code'] = $code;
    }

    exit(json_encode($response));
