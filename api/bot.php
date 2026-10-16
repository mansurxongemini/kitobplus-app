<?php

	function notify($message) {
		$token = '__KP_TELEGRAM_BOT_TOKEN__';
	
		$getQuery = array(
    		"chat_id" 	=> __KP_TELEGRAM_CHAT_ID__,
		    "text"  	=> $message,
    		"parse_mode" => "html"
		);

		$ch = curl_init("https://api.telegram.org/bot". $token ."/sendMessage?" . http_build_query($getQuery));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, false);
		$resultQuery = curl_exec($ch);
		curl_close($ch);
	}

//	echo $resultQuery;
