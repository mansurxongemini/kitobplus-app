<?php
    require_once('../connect2db.php');
    require_once('../upload_file.php');
	require_once('../bot.php');

/*
    $_POST = [
        'platform' => 1,
        'model' => 'debug',
        'phone' => '+12341234',
        'name' => 'Test',
        'address' => 'Some place'
    ];
*/

    //, 'image1', 'image2'
    $params = validate(['phone', 'name', 'birthday', 'address'], $_POST);
    //$params = $_FILES;
    //exit(json_encode(['success' => false, 'error' => 'Development stub [' . array_reduce(array_keys($params), function($res, $_) use ($params) {return $res .= ($res ? ", " : "") . "$_ => " . $params[$_];}, "") . "]"]));

    if (!is_array($_FILES) || !array_key_exists('image1', $_FILES) || !array_key_exists('image2', $_FILES)) {
        exit(json_encode(['success' => false, 'error' => 'Incorrect request (files missing)']));
    }

    if (!(
        $params['user']['state'] == 0 ||
        ($params['user']['state'] == 3 && $params['user']['allow_retry'])
        )
    ) {
        //exit(json_encode(['success' => false, 'error' => 'Incorrect user state (' . json_encode($params['user']) . ')']));
    }

    $image1_id = uploadFile('image1');
    $image2_id = uploadFile('image2');

    query(" update users set
                name = '" . escape($params['name']) . "',
                birthday = '" . escape($params['birthday']) . "',
                address = '" . escape($params['address']) . "',
                image1_id = $image1_id,
                image2_id = $image2_id,
                register_date = NOW(),
                state = 1
            where id = " . $params['user']['id']);
       
    $user = getUser($params['user']['id']);    
    
	notify("Запрос на регистрацию\n$user[name]\n+$user[phone]\n$user[birthday]\n$user[address]");

    exit(json_encode(['success' => true, 'user' => $user]));
