<?php
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');

        require_once('../connect2db.php');

        $params = validate(['id'], FALSE, FALSE, FALSE);

        $params['id'] = intval($params['id']);

        if (!$book = query("select *,name as title from books_view where id = $params[id]")->fetch_assoc()) {
                exit(json_encode(['success' => false, 'error' => "Record #$params[id] not found!"]));
        }

        if (array_key_exists('user', $params) && intval($params['user']['id'])) {
                if ($row = query("select * from playback_positions where users_id = " . $params['user']['id'] . " and books_id = $book[id]")->fetch_assoc()) {
                        $book['track'] = $row['track'];
                        $book['position'] = $row['position'];
                        $book['rate'] = $row['rate'];
                }

                $book['bookshelf_dt'] = (($row = query("select dt from bookshelfs where users_id = " . $params['user']['id'] . " and books_id = $book[id]")->fetch_assoc()) ? $row['dt'] : NULL);

                $book['bookmarks'] = [];
                query("select * from bookmarks where users_id = " . $params['user']['id'] . " and books_id = $book[id] order by track, position");
                while ($row = fetch()) {
                        $book['bookmarks'][] = [
                                'track' => intval($row['track']),
                                'position' => intval($row['position']),
                                'dt' => $row['dt']
                        ];
                }

                $book['like'] = (($row = query("select * from likes where books_id = $params[id] and users_id = " . $params['user']['id'])->fetch_assoc()) ? intval($row['liked']) : 0);
        }

        $book['authors'] = fetch_all("select a.*,p.ext pics_ext from authors a join books2authors b2a on a.id = b2a.authors_id left join pics p on p.target='authors' and p.id = b2a.authors_id where b2a.books_id = $params[id] order by b2a.pos");
        $book['dictors'] = fetch_all("select d.*,p.ext pics_ext from dictors d join books2dictors b2d on d.id = b2d.dictors_id left join pics p on p.target='dictors' and p.id = b2d.dictors_id where b2d.books_id = $params[id] order by b2d.pos");
        $book['genres'] = fetch_all("select g.*,p.ext pics_ext from genres g join books2genres b2g on g.id = b2g.genres_id left join pics p on p.target='genres' and p.id = b2g.genres_id where b2g.books_id = $params[id] order by b2g.pos");

        exit(json_encode(['success' => true, 'data' => $book]));
