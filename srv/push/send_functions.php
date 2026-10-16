<?php
require 'vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

function send($title, $body, $tokens, $data = []) {
    $factory = (new Factory)->withServiceAccount('/var/www/kitobplus-sign-in-firebase-adminsdk-fbsvc-64b873940b.json');
    $messaging = $factory->createMessaging();

    $notification = Notification::create($title, $body);

    $successes = [];
    $message = CloudMessage::new()
        ->withNotification($notification)
        ->withData($data);

    $report = $messaging->sendMulticast($message, $tokens);

    $success = $report->successes()->count();
    $failure = $report->failures()->count();

    foreach ($report->successes()->getItems() as $item) {
        $message = json_decode(json_encode($item->message()), 1);
        $successes[] = $message['token'];
    }

    return [$success, $failure, $successes];
}