<?php
/*
    function errHandle($errNo, $errStr, $errFile, $errLine) {
        $msg = "$errStr in $errFile on line $errLine";
        if ($errNo == E_NOTICE || $errNo == E_WARNING) {
            throw new ErrorException($msg, $errNo);
        } else {
            echo $msg;
        }
    }
    set_error_handler('errHandle');
*/
    function cmd($command, $action, $id) {
        $out = [];
        exec($command . " 2>&1", $out, $ec);
        if ($ec) {
            throw new Exception("$action\nExecute $command failed with error $ec");
        }
        return $out;
    }

    function getParam($file, $param, $param_name, $id, $type_verification = FALSE, $type_name = FALSE) {
        $action = "get $param_name for $file";
        $out = cmd("soxi $param " . escapeshellarg($file), $action, $id);
        if (count($out) != 1 || !floatval($out[0])) {
            throw new Exception("get $param_name for $file");
        }

        if ($type_verification && !preg_match($type_verification, $out[0])) {
            throw new Exception("verify $param_name ($out[0]) for type $type_name for file $file");
        }

        return $out[0];
    }

    function getIntParam($file, $param, $param_name, $id) {
        return intval(getParam($file, $param, $param_name, $id, '/^\d+$/', "int"));
    }

    function getFloatParam($file, $param, $param_name, $id) {
        return floatval(getParam($file, $param, $param_name, $id, '/^\d+(\.\d+)?$/', "float"));
    }

    function preview_cleanup($id, $cleanup_result = false) {
        foreach (['body', 'chunk', 'preview', 'notification', 'tmp', ''] as $suffix) {
            $fname = "/tmp/4preview_${id}" . ($suffix ? "_${suffix}" : "") . ".wav";
            if (is_file($fname)) {
                unlink($fname);
            }
        }

        if ($cleanup_result && is_file("/kitobplus/books/storage/$id.mp3")) {
            unlink("/kitobplus/books/storage/$id.mp3");
        }
    }

    function genPreview($books_id, $notification) {
        $id = sprintf("%05d", $books_id);
        $result = false;
        try {
            genPreviewProcess($id, $notification);
            $result = true;
        } catch (Exception $e) {
            echo "Generate preview for book $books_id failed. Error while " . $e->getMessage() . ".\n";
        }

        preview_cleanup($id, !$result);
        return $result;
    }

    function genPreviewProcess($id, $notification) {
        if (!is_dir("/kitobplus/books/storage/$id")) {
            throw new Exception("Book directory /kitobplus/books/storage/$id not found!");
        }

        if (!is_file($notification)) {
            throw new Exception("Notification file $notification not found!");
        }

        $notification_duration = getFloatParam($notification, '-D', 'duration', $id);

        $len = 180 - $notification_duration;

        $mp3s = glob("/kitobplus/books/storage/$id/*.mp3");
        if (!count($mp3s)) {
            throw new Exception("No mp3 files found in /kitobplus/books/storage/$id");
        }

        sort($mp3s);

        $rate = getIntParam($mp3s[0], '-r', 'sample rate', $id);
        $channels = getIntParam($mp3s[0], '-c', 'channels', $id);

        for ($i = 0; $i < count($mp3s); $i++) {
            $used_len = ($i ? getFloatParam("/tmp/4preview_${id}_body.wav", '-D', 'duration', $id) : 0);

	    if ($len - $used_len < 0.1) {
		break;
	    }

            $last = true;
	    $d = getFloatParam($mp3s[$i], '-D', 'duration', $id);
            if ($d < ($len - $used_len)) {
                $last = false;
            }
	    //echo "$i: d = $d, last = " . ($last ? "true" : "false") . "\n";

            cmd("sox " . escapeshellarg($mp3s[$i]) . " -b 16 -e signed -r $rate -c $channels /tmp/4preview_${id}_chunk.wav " . ($last ? " trim 0 " . ($len - $used_len) : ""), "generate chunk", $id);

            if ($i) {
                cmd("mv /tmp/4preview_${id}_chunk.wav /tmp/4preview_${id}_tmp.wav", "rename chunk to tmp", $id);
                cmd("sox /tmp/4preview_${id}_body.wav /tmp/4preview_${id}_tmp.wav /tmp/4preview_${id}_chunk.wav", "concat chunk to body", $id);
            }

            cmd("mv /tmp/4preview_${id}_chunk.wav /tmp/4preview_${id}_body.wav", "rename chunk to body", $id);
	    if ($last) break;
        }

        cmd("sox " . escapeshellarg($notification) . " -b 16 -e signed -r $rate -c $channels /tmp/4preview_${id}_notification.wav", "generate notification", $id);

        cmd("sox /tmp/4preview_${id}_body.wav /tmp/4preview_${id}_notification.wav /tmp/4preview_$id.wav", "generate preview", $id);

        cmd("lame --quiet -q 0 -b " . ($channels == 1 ? 96 : 128) . "k /tmp/4preview_$id.wav /kitobplus/books/storage/$id.mp3", "encode preview", $id);
    }

/*
    if (php_sapi_name() == "cli") {
	$preview_id = FALSE;
        if (count($_SERVER['argv']) != 2 || !preg_match('/^\d+$/', $_SERVER['argv'][1])) {
//            exit("Incorrect usage!\n");
        } else {
		$preview_id = intval($_SERVER['argv'][1]);
	}

        genPreview($preview_id, '/kitobplus/notifications/demo/tts/woman.wav');
    }
*/
