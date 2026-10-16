<?php
    require_once('connect2db.php');

    function uploadFile($name) {
        if (!array_key_exists($name, $_FILES)) {
            exit(json_encode(['success' => false, "File $name is missing"]));
        }

        $file = &$_FILES[$name];

        $ext = preg_replace('/^.*\.([^.]+)$/u', '$1', $file['name']);

        query("insert into users_files (name, ext, size) values ('" . escape($file['name']) . "', '" . escape($ext) . "', " . intval($file['size']) . ")");
        $id = insert_id();
        $target = "/var/www/html/restricted/users_files/$id.$ext";
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            query("delete from users_files where id = $id");
            exit(json_encode(['success' => false, 'error' => $file["error"]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
        //query("update files set size = " . intval(filesize($target)) . " where id = $id");
        return $id;
    }

    function uploadFileEx(&$file, $target) {
        $ext = preg_replace('/^.*\.([^.]+)$/u', '$1', $file['name']);
        $target = "/var/www/html/$target.$ext";
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            exit(json_encode(['success' => false, 'error' => $file["error"]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
		return $ext;
    }
