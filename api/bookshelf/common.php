<?php
    function getBookshelf($users_id) {
        return fetch_all("select * from bookshelfs where users_id = $users_id");
    }

    function bookshelf_success() {
        global $params;

        exit(json_encode([
            'success' => true,
            'bookshelf' => getBookshelf($params['user']['id'])
        ]));
    }