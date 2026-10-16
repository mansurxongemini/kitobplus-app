<?php

    function executeHttpRequest($func, $params = FALSE, $is_delete = FALSE, $timeout = 30) {
        global $merchant_user_id, $secret_key;

        $timestamp = time();
        $digest = sha1($timestamp . $secret_key);
        $auth_header = $merchant_user_id . ':' . $digest . ':' . $timestamp;
        $headers = [
            'Accept: application/json',
            'Content-Type: application/json',
            'Auth: ' . $auth_header
        ];

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, 'https://api.click.uz/v2/merchant/' . $func);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);        
        if ($is_delete) {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
        }

        if ($params !== FALSE) {
            $request_body = json_encode($params);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $request_body);
        }

        $response = curl_exec($curl);
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $error = curl_error($curl);

        curl_close($curl);

        if ($error) {
            return [
                'success' => false,
                'error' => 'cURL Error: ' . $error,
                'http_code' => 0,
                'response' => null,
                'raw_response' => null
            ];
        }

        $decoded_response = json_decode($response, true);
        
        return [
            'success' => $http_code >= 200 && $http_code < 300,
            'http_code' => $http_code,
            'response' => $decoded_response,
            'raw_response' => $response,
            'error' => null
        ];
    }
