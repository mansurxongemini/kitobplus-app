<?php
require_once '../connect2db.php';
require_once 'vendor/autoload.php';

#$json_str = file_get_contents('php://input');
#$json_obj = json_decode($json_str);
#$id_token = $json_obj->google_token;
$params = validate(['google_token', 'fcm_token?'], $json = FALSE, FALSE, FALSE, TRUE);
$id_token = $params['google_token'];
$fcm_token = $params['fcm_token'] ?? '';

// Логирование для отладки
error_log("Google OAuth attempt at " . date('Y-m-d H:i:s'));
error_log("Token received: " . substr($id_token, 0, 50) . "...");
error_log("FCM token present: " . (!empty($fcm_token) ? 'yes' : 'no'));

// Поддерживаем несколько Client IDs для разных платформ
$CLIENT_IDS = [
    '1037513626119-tr0e89854umsklsgog6ak8qmrgmmolps.apps.googleusercontent.com', // Server/Backend
    '564471302399-6v6vc5iufu9v0iu5c93rl951vp3o5lgr.apps.googleusercontent.com', // Web Client (используется в React Native)
];

error_log("Verifying token with Client IDs: " . implode(', ', $CLIENT_IDS));

// Пробуем верифицировать токен с каждым Client ID
$payload = null;
$last_error = null;

foreach ($CLIENT_IDS as $client_id) {
    try {
        error_log("Trying Client ID: " . $client_id);
        $client = new Google_Client(['client_id' => $client_id]);
        $payload = $client->verifyIdToken($id_token);

        if ($payload) {
            error_log("Token verified successfully with Client ID: " . $client_id);
            break;
        }
    } catch (Exception $e) {
        $last_error = $e;
        error_log("Failed with Client ID " . $client_id . ": " . $e->getMessage());
        continue;
    }
}

try {
    if (!$payload) {
        throw new Exception($last_error ? $last_error->getMessage() : 'Token verification failed with all Client IDs');
    }

    if ($payload) {
        error_log("Token verification successful");
        error_log("User ID: " . $payload['sub']);
        error_log("Email: " . $payload['email']);
        error_log("Token audience: " . $payload['aud']);
        // Токен действителен
        
        // --- Важные проверки безопасности ---
        // 1. Проверьте, что audience (aud) в токене соответствует одному из наших Client IDs.
        //    Библиотека делает это автоматически, но двойная проверка не повредит.
        if (!in_array($payload['aud'], $CLIENT_IDS)) {
            error_log("Invalid audience: " . $payload['aud'] . " not in allowed list");
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid audience.']);
            exit;
        }
        error_log("Audience check passed: " . $payload['aud']);

        // 2. Проверьте, что эмитент (iss) является accounts.google.com или https://accounts.google.com.
        if ($payload['iss'] !== 'https://accounts.google.com' && $payload['iss'] !== 'accounts.google.com') {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid issuer.']);
            exit;
        }

        // --- Токен прошел все проверки ---
        
        // Теперь вы можете использовать данные пользователя из $payload
        $userid = $payload['sub'];      // Уникальный ID пользователя Google
        $email = $payload['email'];      // Email пользователя
        $name = $payload['name'] ?? '';  // Имя пользователя
        $picture = $payload['picture'] ?? '';  // URL аватара

        error_log("User data from Google:");
        error_log("  - User ID: " . $userid);
        error_log("  - Email: " . $email);
        error_log("  - Name: " . $name);
        error_log("  - Picture: " . $picture);

        // Здесь ваша логика:
        // - Проверьте, есть ли пользователь с таким $userid или $email в вашей базе данных.
        // - Если нет, создайте нового пользователя.
        // - Создайте сессию для пользователя и верните на фронтенд подтверждение успешного входа.

        $user = signin('google', $userid, $email, $name);
        error_log("User after signin: id=" . $user['id'] . ", name=" . $user['name']);
        $token = issueToken($user['id'], $params['platform'], $params['model'], $fcm_token);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => $user
        ]);
    } else {
        // Недействительный токен
        error_log("Token verification failed: payload is empty");
        //http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid ID token.']);
    }
} catch (Exception $e) {
    // Обработка других ошибок, например, проблем с сетью или неверного формата токена
    error_log("Token verification exception: " . $e->getMessage());
    error_log("Exception trace: " . $e->getTraceAsString());
    //http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token verification failed: ' . $e->getMessage()]);
}
