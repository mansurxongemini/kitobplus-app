<?php
    require_once('../connect2db.php');
    require_once('click.php');

    $params = validate(['token', 'plans_id']);

    if ($params['user']['plans_id'] == 2) exit(json_encode(['success' => false, 'error' => 'Оплата недоступна']));
    $plans_id = intval($params['plans_id']);

    if (!($plan = fetch_row("select * from premium_plans where id = $plans_id and enabled = 1"))) {
        exit(json_encode(['success' => false, 'error' => 'Некорректный тариф']));
    }

    if ($row = fetch_row("
        select id, TIMESTAMPDIFF(MINUTE, dt, now()) minutes_left
        from invoices
        where users_id = " . $params['user']['id'] . " and payed = 0 and cancelled = 0 and error is null and dt > date_sub(NOW(), INTERVAL 5 MINUTE)
        order by id desc
    ")) exit(json_encode([
        'success' => false,
        'error' => 'У вас уже есть неоплаченный счёт ' . transaction_param($row['id']) . "\nон автоматически аннулируется через " . max(1, 5 - $row['minutes_left']) . " мин. и вы сможете повторить оплату",
        'invoices_id' => $invoices_id
    ]));

    //query("update invoices set cancelled = 1 where users_id = " . $params['user']['id'] . " and payed = 0 and cancelled = 0 and error is null");

    //$transaction_param = $params['user']['name'];//"kp" . sprintf("%06d", $invoices_id);
    $amount = sprintf("%.02f", $plan['price']);
    
    query("insert into invoices (users_id, dt, amount, months) values (" . $params['user']['id'] . ", now(), '$amount', $plan[amount])");
    $invoices_id = insert_id();

    $transaction_param = transaction_param($invoices_id);
    exit(json_encode(['success' => true, 'data' => [
        'merchant_id' => $merchant_id,
        'merchant_user_id' => $merchant_user_id,
        'service_id' => $service_id,
        'amount' => $amount,
        'transaction_param' => $transaction_param
    ]]));

    $result = createInvoice($params['user']['phone'], $amount, $transaction_param);
    
    if (!$result || !$result['success']) {
        query("delete from invoices where id = $invoices_id");
        exit(json_encode(['success' => false, 'error' => 'Ошибка во время регистрации инвойса' . ($result ? " ($result[error])" : "")]));
    }

    if ($result['response']['error_code']) {
        query("delete from invoices where id = $invoices_id");
        exit(json_encode(['success' => false, 'error' => 'click.uz вернул ошибку (' . $result['response']['error_code'] . ') - ' . $result['response']['error_note']]));
    }

    //file_put_contents('createInvoice.json', json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    //query("insert into invoices (users_id, click_id, dt) values (" . $params['user']['id'] . ", '" . escape($result['response']['invoice_id']) . "', now())");
    query("update invoices set click_id = '" . escape($result['response']['invoice_id']) . "' where id = $invoices_id");

    exit(json_encode(['success' => true, 'data' => [
        'merchant_id' => $merchant_id,
        'merchant_user_id' => $merchant_user_id,
        'service_id' => $service_id,
        'amount' => $amount,
        'transaction_param' => $transaction_param
    ]]));
