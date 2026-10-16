<?php
    function getComments($books_id) {
        query("select c.*, u.name as users_name from comments c join users u on c.users_id = u.id where books_id = $books_id order by dt desc");
        
        $comments = [];
        while ($row = fetch()) {
            $comments[] = [
                'id' => intval($row['id']),
                'users_id' => intval($row['users_id']),
                'user' => $row['users_name'],
                'dt' => preg_replace("/^(\d\d\d\d)-(\d\d)-(\d\d).*$/", "$3.$2.$1", $row['dt']),
                'comment' => $row['comment'],
            ];
        }

        return $comments;
    }


    function comments_success() {
        global $params;

        exit(json_encode([
            'success' => true,
            'comments' => getComments($params['books_id']),
        ]));
    }

    
    function check_permissions($id) {
        global $params;

        if (!$id) {
            return;
        }

        query("select * from comments where id = $id");
        if ($comment = fetch()) {
            if ($comment['users_id'] != $params['user']['id']) {
                exit(json_encode(['success' => false, 'Nice try :)']));
            }
        }
    }