<?php
	function crop($orig, $dest) {
        list($width, $height) = getimagesize($orig);
        
        $is_png = preg_match('/\.png$/u', mb_strtolower($orig));
        $is_webp = preg_match('/\.webp$/u', mb_strtolower($orig));

        $original = FALSE;
        if ($is_png) {
            $original = imagecreatefrompng($orig);
        } elseif ($is_webp) {
            $original = imagecreatefromwebp($orig);
        } else {
            $original = imagecreatefromjpeg($orig);
        }
        
        if ($width > $height) {
            $y = 0;
            $x = round(($width - $height) / 2);
            $smallestSide = $height;
        } else {
            $x = 0;
            $y = round(($height - $width) / 2);
            $smallestSide = $width;
        }

        //$thumb = imagecreatetruecolor($smallestSide, $smallestSide);
        //imagecopyresampled($thumb, $myImage, 0, 0, $x, $y, $thumbSize, $thumbSize, $smallestSide, $smallestSide);
        $cropped = imagecrop($original, ['x' => $x, 'y' => $y, 'width' => $smallestSide, 'height' => $smallestSide]);
        
        if ($is_png) {
            imagepng($cropped, $dest);
        } elseif ($is_webp) {
            imagewebp($cropped, $dest);
        } else {
            imagejpeg($cropped, $dest);
        }
        imagedestroy($cropped);
    }

    header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

	if (!array_key_exists("token", $_GET) || ($_GET["token"] != '__KP_ADMIN_TOKEN__' && !preg_match('/^\d+$/', $_GET['token']))) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

	if (!array_key_exists("target", $_POST) || !in_array($_POST['target'], ['books', 'authors', 'dictors', 'genres']) || !array_key_exists("id", $_POST) || !intval($_POST['id'])) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

	$db = mysqli_connect('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

    if (preg_match('/^\d+$/', $_GET['token'])) {
        $aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
        if (!($user = mysqli_fetch_assoc($aq))) {
            echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
    }

	if (!mysqli_query ($db, "set character_set_client='utf8'")) exit(mysqli_error($db));
	mysqli_query ($db, "set character_set_results='utf8'");
	mysqli_query ($db, "set collation_connection='utf8_general_ci'");


    $DIR = "/var/www/html/pics/$_POST[target]";
    if (!is_dir($DIR)) mkdir($DIR);
    $ext = preg_replace('/^.*\.([^.]+)$/u', '$1', $_FILES['file']['name']);
    $base = "$DIR/" . intval($_POST['id']);
    $uploadfile = "$base.orig.$ext";
    
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
        exit(json_encode(['success' => false, 'error' => $_FILES["file"]["error"]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    crop($uploadfile, "$base.$ext");
    
    if (!mysqli_query($db, "insert into pics (target, id, ext) values ('" . mysqli_real_escape_string($db, $_POST['target']) . "', " . intval($_POST['id']) . ", '" . mysqli_real_escape_string($db, $ext) . "')
                ON DUPLICATE KEY UPDATE
                target = '" . mysqli_real_escape_string($db, $_POST['target']) . "', id = " . intval($_POST['id']) . ", ext = '" . mysqli_real_escape_string($db, $ext) . "'")) {
        exit(json_encode(['success' => false, 'error' => mysqli_error($db)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    exit(json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
