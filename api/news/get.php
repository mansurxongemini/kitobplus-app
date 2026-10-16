<?php
    require_once('../connect2db.php');
    require_once('../save_load_image.php');

    $params = validateAnon(['id', 'register_view?']);

    $params['id'] = intval($params['id']);

    $is_admin = ($params['user']['state'] == 2 && $params['user']['levels_id'] == 1);
        
    if ($params['register_view']) {
        query("insert into news_views (news_id, ip, dt, users_id) values ($params[id], inet_aton('" . $_SERVER['REMOTE_ADDR'] . "'), now(), " . ($params['user'] ? $params['user']['id'] : 'NULL') . ")");
    }
//    if (!($data = fetch_row("select news.*, pics.ext from news left join pics on pics.target = 'news' and pics.id = news.id where id = $params[id] and deleted is null" . ($is_admin ? "" : " and dt <= NOW()")))) {

    if (!($data = fetch_row("
        select
            news.id,
            news.dt as `datetime`,
            subject,
            body,
            pics.ext as pics_ext,
            concat(DATE_FORMAT(news.dt, '%h:%i'), ' ', if (date(news.dt) = date(now()), 'Сегодня', if (date(news.dt) = date(date_sub(now(), INTERVAL 1 DAY)), 'Вчера', DATE_FORMAT(news.dt, '%d.%m.%Y')))) datetime_str,
            count(nv.dt) views
        from news
        left join pics on pics.target = 'news' and pics.id = news.id 
        left join news_views nv on news.id = nv.news_id
        where news.id = $params[id] and deleted is null" . ($is_admin ? "" : " and news.dt <= NOW()") . "
        group by news.id
    "))) {
        exit(json_encode(['success' => false, 'error' => 'Новость не найдена']));
    }

    if ($data['pics_ext']) {
        $e = '';
        $data['imageData'] = imageToBase64("../../pics/news/$data[id].$data[pics_ext]", $e);
    }

    unset($data['ext']);

    exit(json_encode(['success' => true, 'data' => $data]));
