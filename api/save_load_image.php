<?php

    /**
     * Сохраняет изображение из base64 строки в файл
     * 
     * @param string $base64_image_data - Данные изображения в формате "data:image/png;base64,..."
     * @param string $output_dir - Директория для сохранения
     * @param string $file_prefix - Префикс имени файла
     * @return array - Массив с результатом: ['success'=>bool, 'message'=>string, 'file_path'=>string]
     */
    function saveBase64Image($base64_image_data, $output_dir, $file_id, &$error) {

        // Проверяем, что это base64 строка изображения
        if (!preg_match('/^data:image\/(\w+);base64,/', $base64_image_data, $matches)) {
            $error = 'Неверный формат изображения';
            return FALSE;
        }

        $image_type = strtolower($matches[1]); // Получаем тип изображения (jpeg, png и т.д.)
        
        // Проверяем поддерживаемые форматы
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        if (!in_array($image_type, $allowed_types)) {
            $error = 'Неподдерживаемый формат изображения';
            return FALSE;
        }

        // Удаляем префикс base64
        $image_data = substr($base64_image_data, strpos($base64_image_data, ',') + 1);
        $image_data = str_replace(' ', '+', $image_data);
        $decoded_data = base64_decode($image_data);

        // Проверяем, что декодирование прошло успешно
        if ($decoded_data === false) {
            $error = 'Ошибка декодирования base64 строки';
            return FALSE;
        }

        // Генерируем уникальное имя файла
        $file_extension = $image_type === 'jpeg' ? 'jpg' : $image_type;
        $file_name = $file_id . '.' . $file_extension;
        $file_path = "$output_dir/$file_name";

        // Сохраняем файл
        if (!file_put_contents($file_path, $decoded_data)) {
            $error = 'Ошибка при сохранении изображения';
            return FALSE;
        }

        return $file_extension;
    }

    /**
     * Конвертирует изображение из файла в base64 строку
     * 
     * @param string $file_path - Путь к файлу изображения
     * @return array - Массив с результатом: ['success'=>bool, 'message'=>string, 'base64'=>string]
     */
    function imageToBase64($file_path, &$error) {
        // Проверяем существование файла
        if (!file_exists($file_path)) {
            $error = "Файл изображения не найден";
            return FALSE;
        }

        // Проверяем, что это файл изображения
        $mime_types = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'bmp' => 'image/bmp',
        ];

        // Определяем MIME-тип
        $file_info = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($file_info, $file_path);
        finfo_close($file_info);

        // Проверяем поддерживается ли тип изображения
        if (!in_array($mime_type, $mime_types)) {
            $error = "Неподдерживаемый формат изображения";
            return FALSE;
        }

        // Получаем содержимое файла
        $file_data = file_get_contents($file_path);
        if ($file_data === false) {
            $error = 'Ошибка чтения файла';
            return FALSE;
        }

        // Определяем расширение для data-URI
        $extension = array_search($mime_type, $mime_types);
        $base64 = 'data:image/' . $extension . ';base64,' . base64_encode($file_data);

        return $base64;
    }