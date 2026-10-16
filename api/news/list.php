<?php
    require_once('../connect2db.php');
    require_once('common.php');

    $params = validateAnon(['page?', 'per_page?', 'exclude?']);

    $is_admin = ($params['user']['state'] == 2 && $params['user']['levels_id'] == 1);

    $news = fetch_all("
        select
            news.id,
            news.dt as `datetime`,
            subject,
            body,
            pics.ext as pics_ext,
            concat(DATE_FORMAT(news.dt, '%h:%i'), ' ', if (date(news.dt) = date(now()), 'сегодня', if (date(news.dt) = date(date_sub(now(), INTERVAL 1 DAY)), 'вчера', DATE_FORMAT(news.dt, '%d.%m.%Y')))) datetime_str,
            count(nv.dt) views
        from news
        left join pics on pics.target = 'news' and pics.id = news.id 
        left join news_views nv on news.id = nv.news_id
        where deleted is null " . ($is_admin ? "" : "and news.dt <= now()") . " " . (intval($params['exclude']) ? " and news.id != " . intval($params['exclude']) : "") . "
        group by news.id
        order by news.dt desc
        " . (intval($params['per_page']) ? "LIMIT " . intval($page) . ", " . intval($params['per_page']) : "") . "
    ");

    for ($i = 0; $i < count($news); $i++) {
        $news[$i]['body'] = mb_strlen($news[$i]['body']) > 100 ? mb_substr($news[$i]['body'], 0, 80) . '…' : $news[$i]['body'];
    }
    exit(json_encode(['success' => true, 'news' => $news]));
