<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: audio/mpeg');
    
    $KEY = [88,198,204,44,150,113,86,181,130,51,210,157,105,232,161,214,38,239,237,115,143,81,248,184,109,171,136,178,90,190,87,79,175,244,238,220,145,18,56,117,139,76,96,22,26,104,153,45,188,231,229,92,70,98,202,201,93,118,57,179,131,182,126,58,209,168,172,89,82,224,206,49,125,107,252,174,64,167,254,50,27,34,35,24,215,111,148,129,124,187,121,61,103,235,108,28,219,66,255,30,144,194,212,62,19,0,106,68,193,6,146,221,151,40,156,85,39,165,119,8,13,53,123,110,240,52,11,9,54,78,132,120,25,246,147,197,15,217,251,122,173,71,32,102,37,74,2,101,211,222,142,94,73,230,180,69,47,166,114,133,140,177,43,149,33,112,137,200,185,21,247,152,16,5,160,225,134,159,80,48,55,154,189,249,176,236,91,253,60,199,29,95,127,243,155,216,14,12,207,20,213,192,83,158,77,46,7,163,116,203,164,100,241,10,17,31,128,233,72,191,195,226,41,36,208,67,63,234,65,99,245,196,183,170,169,218,138,228,227,75,4,97,23,205,223,162,186,141,1,42,59,135,250,3,242,84];
    
    $headers = getallheaders();
    if (array_key_exists('Authorization', $headers) && preg_match('/^Bearer (\d{19})$/', $headers['Authorization'], $m)) {    
        require_once('../api/connect2db.php');
        $params = validate([]);
        $decode_key = json_decode($params['user']['decode_key']);

        for ($i = 0; $i < count($decode_key); $i++) {
            $KEY[$decode_key[$i]] = $i;
        }

        //error_log("xstream user " . $params['user']['id'] . ", key: [" . implode(", ", array_slice($KEY, 0, 5)) . "...]");
/*
        for ($i = 0; $i < 256; $i++) {
            $KEY[$i] = $i;
        }
*/
    }

    $books_id = sprintf("%05d", (array_key_exists('books_id', $_GET) ? intval($_GET['books_id']) : 0));
    $tracks_id = sprintf("%04d", (array_key_exists('tracks_id', $_GET) ? intval($_GET['tracks_id']) : 0));

    $offset = (array_key_exists('offset', $_GET) ? intval($_GET['offset']) : 0);
    $length = (array_key_exists('length', $_GET) ? intval($_GET['length']) : 0);

    //$location = "/mnt/240g/html5audio/gg.mp3";
    //$location = "/mnt/240g/html5audio/small.mp3";
    $location = "/kitobplus/books/storage/$books_id/$tracks_id.mp3";

    if (!file_exists($location)) {
        http_response_code(404);
        exit("$location not found!");
    }

    $first = 0;
    $size = filesize($location);
	$last = $size - 1;

    if (array_key_exists('offset', $_GET) && $length && $offset < $length) {
        $first = round($size * $offset / $length);
        header("Content-Length: " . ($last + 1 - $first));
        header("Content-Range: bytes $first-$last/$size");
    } else {
        $m = [];
        if(isset($_SERVER['HTTP_RANGE'])&&preg_match('/^bytes=([0-9]+)-([0-9]*)$/',$_SERVER['HTTP_RANGE'],$m)) {
            $first = intval($m[1]);
            if ($first >= $size) {
                http_response_code(404);
                exit("offset $range out of range (0-$size)");
            }

            $last = ((count($m) > 2 && $m[2]) ? intval($m[2]) : $size - 1);
            $new_length = $last + 1 - $first;
            header("HTTP/1.1 206 Partial Content");
            header("Content-Length: " . ($last - $first + 1));
            header("Content-Range: bytes $first-$last/$size");
        } else {
//            header("Content-Range: bytes 0-$size2/$size");
            header("Content-Length: $size");
        }
    }

    header("Content-Type: application/octet-stream");

    if ($_SERVER['REQUEST_METHOD'] === "HEAD") {
        exit;
    }

    function crpt($buf) {
        global $KEY;

        $l = strlen($buf);
        $b = array_values(unpack("C$l", $buf));
        //if ($_GET['mk'] ?? FALSE) error_log("crpt values " . count($b));
        for ($i = 0; $i < $l; $i++) {
            $b[$i] = $KEY[$b[$i]];
        }        
        return pack("C$l", ...$b);
    }
    
    $f = fopen($location, 'rb');
    $p = $first;
    fseek($f, $p);

    $first = true;
    while ($p < $last + 1) {
        $bs = min(8192, $last + 1 - $p);
        $buf = fread($f, $bs);
        if (strlen($buf) != $bs) {
            http_response_code(500);
            exit("$location read error!");
        }
        $buf = crpt($buf);
        echo $buf;
        $p += $bs;
    }

    fclose($f);
