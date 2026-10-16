<?php
    function getBookmarks($users_id, $books_id) {
        query("select * from bookmarks where users_id = $users_id and books_id = $books_id order by track, position");
        
        $bookmarks = [];
        while ($row = fetch()) {
            $bookmarks[] = [
                'track' => intval($row['track']),
                'position' => intval($row['position']),
            ];
        }

        return $bookmarks;
    }


    function bookmarks_success() {
        global $params;

        exit(json_encode([
            'success' => true,
            'bookmarks' => getBookmarks($params['user']['id'], intval($params['books_id']))
        ]));
    }