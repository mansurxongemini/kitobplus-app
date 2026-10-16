<?php
    require_once('../connect2db.php');

    $params = validate([]);

    exit(json_encode(['success' => true, 'plans' => getPremiumPlans(true)]));
