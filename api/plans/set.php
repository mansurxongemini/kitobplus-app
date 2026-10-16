<?php
    require_once('../connect2db.php');

    $params = validate(['id', 'enabled', 'price']);
    $id = intval($params['id']);
    $enabled = intval($params['enabled']);
    $price = intval($params['price']);

    query("update premium_plans set enabled = $enabled, price = $price where id = $id");

    $plans = fetch_all("select * from premium_plans order by id");
    $plans = array_map(function($_) {
        return [
            'id' => intval($_['id']),
            'amount' => intval($_['amount']),
            'enabled' => intval($_['enabled']),
            'price' => intval($_['price']),
            'name' => $_['name']
        ];
    }, $plans);
    exit(json_encode(['success' => true, 'plans' => $plans]));
