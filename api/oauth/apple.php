<?php
require_once('../connect2db.php');
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;

/*
// --- Получаем данные от фронтенда ---
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str);
$authCode = $json_obj->authorization->code;
$idToken = $json_obj->authorization->id_token;
*/
$params = validate(['authorization', 'fcm_token?', 'os?'], $json = FALSE, FALSE, FALSE, TRUE);
$authCode = $params['authorization']['code'];
$idToken = $params['authorization']['id_token'];
$fcm_token = $params['fcm_token'] ?? '';
$os = $params['os'] ?? 'unknown'; // По умолчанию unknown (не ios!)

// DEBUG: Логируем входные параметры
error_log("=== Apple Sign-In Debug ===");
error_log("OS: " . $os);
error_log("AuthCode present: " . (!empty($authCode) ? 'YES' : 'NO'));
error_log("IdToken present: " . (!empty($idToken) ? 'YES' : 'NO'));
error_log("FCM token present: " . (!empty($fcm_token) ? 'YES' : 'NO'));

// Определяем конфигурацию в зависимости от платформы
// iOS конфигурация используется ТОЛЬКО при явном указании os === 'ios'
if ($os === 'ios') {
    // iOS - native Apple Sign-In (Team приложения)
    $teamId = 'PH2G975837';
    $clientId = 'uz.kitobplus.app';
    $keyId = 'G28MQZGPQR';
    $keyFilePath = '/var/www/AuthKey_G28MQZGPQR.p8';
    error_log("Using iOS configuration (Team: PH2G975837, Bundle ID)");
} else {
    // Android/Web/Default - web-based Sign-In (Личный Team)
    // Используется для Android, Web, и когда os не указан
    $teamId = 'VG4MMX5Q36';
    $clientId = 'uz.kitobplus.signin';
    $keyId = '8N2V4AXYKK';
    $keyFilePath = '/var/www/AuthKey_8N2V4AXYKK.p8';
    error_log("Using Android/Web configuration (Team: VG4MMX5Q36, Service ID)");
}

error_log("Selected client_id: " . $clientId);

// --- 1. Создаем Client Secret ---
function createClientSecret($teamId, $clientId, $keyId, $keyFilePath) {
    $keyContent = file_get_contents($keyFilePath);
    $payload = [
        'iss' => $teamId,
        'iat' => time(),
        'exp' => time() + 86400 * 180, // Срок жизни не более 6 месяцев
        'aud' => 'https://appleid.apple.com',
        'sub' => $clientId,
    ];
    return JWT::encode($payload, $keyContent, 'ES256', $keyId);
}

try {
    error_log("Creating client secret...");
    error_log("Team ID: " . $teamId);
    error_log("Client ID: " . $clientId);
    error_log("Key ID: " . $keyId);
    error_log("Key file exists: " . (file_exists($keyFilePath) ? 'YES' : 'NO'));

    $clientSecret = createClientSecret($teamId, $clientId, $keyId, $keyFilePath);
    error_log("Client secret created successfully");
    error_log("Client secret (first 50 chars): " . substr($clientSecret, 0, 50) . "...");

    // --- 2. Обмениваем authorization_code на access_token и refresh_token ---
    $url = 'https://appleid.apple.com/auth/token';
    $data = [
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'code' => $authCode,
        'grant_type' => 'authorization_code',
        // 'redirect_uri' => 'https://yourdomain.com/auth/apple/callback' // redirect_uri должен совпадать с тем, что был на фронтенде
    ];

    error_log("Exchanging authorization code with Apple...");
    error_log("Request data: client_id=" . $clientId . ", grant_type=authorization_code");
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    error_log("Apple response HTTP code: " . $httpCode);
    error_log("Apple raw response: " . $response);
    //file_put_contents('response.json', $response);

    $tokenData = json_decode($response, true);

    if (isset($tokenData['error'])) {
        error_log("Apple token exchange failed: " . $tokenData['error']);
        $errorDescription = $tokenData['error_description'] ?? $tokenData['error'];
        error_log("Error description: " . $errorDescription);
        throw new Exception('Apple token exchange error: ' . $errorDescription);
    }

    error_log("Token exchange successful");

/*
    // --- 3. Верифицируем ID Token ---
    // Apple предоставляет публичные ключи для верификации JWT
    $applePublicKeys = json_decode(file_get_contents('https://appleid.apple.com/auth/keys'), true);
    
    // `id_token` из $tokenData (а не тот, что пришел с фронтенда) считается более надежным.
    $idTokenFromApple = $tokenData['id_token'];
    
    $params = ['ES256'];
    $payload = JWT::decode($idTokenFromApple, JWK::parseKeySet($applePublicKeys), ['ES256']);

    // --- 4. Проверяем данные в токене ---
    if ($payload->iss !== 'https://appleid.apple.com') {
        throw new Exception('Invalid issuer.');
    }
    if ($payload->aud !== $clientId) {
        throw new Exception('Invalid audience.');
    }
    // `exp` проверяется автоматически библиотекой JWT::decode

    file_put_contents('payload.json', json_encode($payload));
    // --- Токен валиден! ---
    $appleUserId = $payload->sub;
    $email = $payload->email ?? null;
    $isEmailVerified = $payload->email_verified ?? false;

    // Ваша логика: найти или создать пользователя в БД по $appleUserId
    // ...

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Apple login successful!',
        'user' => [
            'apple_id' => $appleUserId,
            'email' => $email,
        ]
    ]);

*/
    $idTokenFromApple = $tokenData['id_token'];

    // --- 3. Верифицируем ID Token (обновленный код) ---
    error_log("Verifying ID token...");

    // Сначала получаем kid (Key ID) из заголовка токена
    $tks = explode('.', $idTokenFromApple);
    if (count($tks) != 3) {
        error_log("Invalid token format: wrong number of segments");
        throw new Exception('Wrong number of segments in token');
    }
    $header = JWT::jsonDecode(JWT::urlsafeB64Decode($tks[0]));
    $kid = $header->kid;
    error_log("Token kid: " . $kid);

    // Загружаем публичные ключи Apple
    error_log("Fetching Apple public keys...");
    $applePublicKeys = JWK::parseKeySet(
        json_decode(file_get_contents('https://appleid.apple.com/auth/keys'), true)
    );

    // Ищем в наборе ключ с нужным kid
    if (!isset($applePublicKeys[$kid])) {
        error_log("Public key not found for kid: " . $kid);
        throw new Exception('Invalid kid');
    }

    // Получаем ключ для декодирования
    $publicKey = $applePublicKeys[$kid];
    error_log("Public key found, decoding token...");

    // Декодируем токен, используя найденный публичный ключ.
    // Третий параметр больше не нужен.
    $payload = JWT::decode($idTokenFromApple, $publicKey);

    error_log("Token decoded successfully");
    //file_put_contents('payload.json', json_encode($payload));

    // --- 4. Проверяем данные в токене ---
    error_log("Verifying token claims...");
    error_log("Token issuer: " . $payload->iss);
    error_log("Token audience: " . $payload->aud);
    error_log("Expected audience: " . $clientId);

    if ($payload->iss !== 'https://appleid.apple.com') {
        error_log("Invalid issuer: " . $payload->iss);
        throw new Exception('Invalid issuer.');
    }
    if ($payload->aud !== $clientId) {
        error_log("Audience mismatch! Expected: " . $clientId . ", Got: " . $payload->aud);
        throw new Exception('Invalid audience.');
    }
    // Срок действия (exp) проверяется автоматически методом JWT::decode

    error_log("Token claims verified successfully");

    // --- Токен валиден! ---
    $appleUserId = $payload->sub;
    $email = $payload->email ?? null;
    $name = $payload->name ?? null;
    //$isEmailVerified = $payload->email_verified ?? false;

    error_log("Apple User ID: " . $appleUserId);
    error_log("Email: " . ($email ?? 'NOT PROVIDED'));
    error_log("Name: " . ($name ?? 'NOT PROVIDED'));

    error_log("Calling signin()...");
    $user = signin('apple', $appleUserId, $email, $name);
    error_log("User signed in successfully, user_id: " . $user['id']);

    error_log("Issuing token...");
    $token = issueToken($user['id'], $params['platform'], $params['model'], $fcm_token);
    error_log("Token issued successfully");
    error_log("=== Apple Sign-In Success ===");

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => $user
    ]);
/*
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Apple login successful!',
        'user' => [
            'apple_id' => $appleUserId,
            'email' => $email,
        ]
    ]);
*/
} catch (Exception $e) {
    error_log("=== Apple Sign-In FAILED ===");
    error_log("Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    //http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Apple token verification failed: ' . $e->getMessage()]);
}
