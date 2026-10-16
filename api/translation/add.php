<?php
        require_once('../connect2db.php');

        $params = validate(['code', 'ru'], FALSE, FALSE, FALSE);
        $params['code'] = strtolower($params['code']);
        if (!in_array($params['code'], ['uz', 'us'])) {
                exit(json_encode(['success' => false, 'error' => "Unsupported country code " . mb_strtoupper($params['code'])]));
        }

        query("select $params[code] as t from translation where ru = '" . escape($params['ru']) . "'");

        if ($t = fetch()) {
                exit(json_encode(['success' => true, 'result' => 'exists', 'T' => $t['t']]));
        };

        query("insert into translation (ru, $params[code]) values ('" . escape($params['ru']) . "', '') on duplicate key update ru = '" . escape($params['ru']) . "'");
        exit(json_encode(['success' => true, 'result' => 'added']));
