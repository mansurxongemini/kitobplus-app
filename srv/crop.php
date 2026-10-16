<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit(json_encode(['success' => true, 'error' => $db->error], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $qr;
    }

    function crop($orig, $dest, $crop = FALSE) {
        list($width, $height) = getimagesize($orig);

        $is_png = preg_match('/\.png$/', mb_strtolower($orig));
        $is_webp = preg_match('/\.webp$/', mb_strtolower($orig));

        $original = FALSE;
        if ($is_png) {
            $original = imagecreatefrompng($orig);
        } elseif ($is_webp) {
            $original = imagecreatefromwebp($orig);
        } else {
            $original = imagecreatefromjpeg($orig);
        }

        if ($crop) {
            $x = round($width * floatval($crop['x']));
            $y = round($height * floatval($crop['y']));
            if ($x < $width && $y < $height) {
                $smallestSide = min(round($width * $crop['width']), round($height * $crop['height']));
            } else {
                $crop = FALSE;
            }
        }

        if (!$crop) {
            if ($width > $height) {
                $y = 0;
                $x = round(($width - $height) / 2);
                $smallestSide = $height;
            } else {
                $x = 0;
                $y = round(($height - $width) / 2);
                $smallestSide = $width;
            }
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

    $json = file_get_contents('php://input');
	if (
        !($params = json_decode(file_get_contents('php://input'), true)) || 
        !array_key_exists("target", $params) || 
        !in_array($params['target'], ['books', 'authors', 'dictors', 'genres']) || 
        !array_key_exists("id", $params) || !intval($params['id']) ||
        !array_key_exists("crop", $params)
    ) {
		echo json_encode(['success' => false, 'error' => 'Incorrect request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		exit;
	}

    $params['id'] = intval($params['id']);

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');
	assert($db);

    if (preg_match('/^\d+$/', $_GET['token'])) {
        $aq = mysqli_query($db, "select u.* from users u join tokens2 t2 on u.id = t2.users_id and u.levels_id != 1 and u.state = 2");
        if (!($user = mysqli_fetch_assoc($aq))) {
            echo json_encode(['success' => false, 'error' => 'Access denied'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
    }

    ($pic = sql("select * from pics where target = '$params[target]' and id = $params[id]")->fetch_assoc()) || exit(json_encode(['success' => false, 'error' => "Image #$params[id] not found!"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    $DIR = "/var/www/html/pics/$params[target]";
    crop("$DIR/$pic[id].orig.$pic[ext]", "$DIR/$pic[id].$pic[ext]", $params['crop']);
    
    sql("update pics set crop = '" . $db->real_escape_string($json) . "' where id = $pic[id]");

    exit(json_encode(['success' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
