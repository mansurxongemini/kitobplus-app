<?php
/**
 * Отправляет Push-уведомления на массив FCM токенов.
 * 
 * @param array $tokens Массив FCM токенов получателей (максимум 1000).
 * @param string $title Заголовок уведомления.
 * @param string $body Текст уведомления.
 * @param array $data Необязательный массив с дополнительными данными.
 * @return array|false Ответ от сервера FCM в виде ассоциативного массива или false в случае ошибки cURL.
 */
function sendFcmNotification(array $tokens, string $title, string $body, array $data = []) {
    // ВАЖНО: Замените 'YOUR_FCM_SERVER_KEY' на ваш реальный ключ сервера
    $serverKey = 'YOUR_FCM_SERVER_KEY'; 

    if (empty($tokens)) {
        error_log("FCM Error: массив токенов пуст.");
        return false;
    }
    
    $fcmUrl = 'https://fcm.googleapis.com/fcm/send';

    // Полезная нагрузка (payload) для уведомления
    // 'notification' - отвечает за видимую часть уведомления (title, body),
    // когда приложение в фоне или закрыто.
    $notificationPayload = [
        'title' => $title,
        'body' => $body,
        'sound' => 'default' // Стандартный звук уведомления
    ];

    // 'data' - отвечает за передачу кастомных данных в приложение.
    // Эти данные приходят всегда, даже когда приложение открыто.
    $fields = [
        'registration_ids' => $tokens,
        'notification' => $notificationPayload,
        'data' => $data,
        'priority' => 'high' // Высокий приоритет для быстрой доставки
    ];

    $headers = [
        'Authorization: key=' . $serverKey,
        'Content-Type: application/json'
    ];

    // Инициализация cURL
    $ch = curl_init();
    
    // Настройка cURL
    curl_setopt($ch, CURLOPT_URL, $fcmUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // В продакшене лучше настроить SSL
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    // Выполнение запроса
    $result = curl_exec($ch);

    if ($result === false) {
        error_log('FCM cURL Error: ' . curl_error($ch));
        curl_close($ch);
        return false;
    }

    // Закрытие cURL
    curl_close($ch);

    // Возвращаем ответ от FCM, декодированный в ассоциативный массив
    return json_decode($result, true);
}