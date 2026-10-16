<?php
    function request($func, $payload) {        
        $payload = json_encode($payload);
        $ch = curl_init("http://audiologos.ru:6001/$func");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);          
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [         
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            error_log('Ошибка cURL: ' . curl_error($ch));
            return FALSE;
        }

        if (!($json = json_decode($response, true))) {
            error_log('Ошибка во время декодирования ответа ' . $response);
            return FALSE;
        }

        if (array_key_exists('error', $json)) {
            error_log('Сервер вернул ошибку ' . $json['error']);
            return FALSE;
        }

        curl_close($ch);
        return $json;
    }

    function li_search($query) {
        if (!($json = request('search', ['query' => $query]))) return FALSE;
        return $json['books'];
    }

    function li_recommend($books_id) {
        if (!($json = request('recommend', ['id' => $books_id]))) return FALSE;
        return $json['books'];
    }
