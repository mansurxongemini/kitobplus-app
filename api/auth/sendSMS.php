<?php

    function sendSMS($number, $message) {
//        $ch = curl_init("http://83.69.139.182:8080/");
		$ch = curl_init("http://198.163.207.66:8083");

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
//        curl_setopt($ch, CURLOPT_POSTFIELDS, "login=__KP_SMS_LOGIN__&password=__KP_SMS_PASSWORD__&data=" . json_encode([['phone' => $number, 'text' => utf8_encode($message)]]));
        curl_setopt($ch, CURLOPT_POSTFIELDS, "login=__KP_SMS_LOGIN__&password=__KP_SMS_PASSWORD__&data=" . json_encode([['phone' => $number, 'text' => utf8_encode($message)]]));

        $result = curl_exec($ch);
        curl_close($ch);

        $json = json_decode($result, true);


        //file_put_contents('response.json', json_encode($json));
        if (!is_array($json) || array_key_exists('error', $json[0])) {
            return false;
        }

        return true;
    }
