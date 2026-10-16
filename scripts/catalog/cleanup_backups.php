<?php
	function errHandle($errNo, $errStr, $errFile, $errLine) {
    	$msg = "$errStr in $errFile on line $errLine";
    	if ($errNo == E_NOTICE || $errNo == E_WARNING) {
        	throw new ErrorException($msg, $errNo);
    	} else {
        	echo $msg;
    	}
	}

	set_error_handler('errHandle');

    function sql($q) {
        global $db;
        ($qr = $db->query($q)) || exit($db->error . "\n");
        return $qr;
    }

    $db = new mysqli('localhost', 'kitobplus', '__KP_DB_PASSWORD__', 'kitobplus');

    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    $backups = array_merge(glob("/kitobplus/backup/*"), glob("/kitobplus/books/backup/*"));

	$books = [];
	foreach (sql("select * from books") as $book) {
		$books[basename($book['folder'])] = $book['id'];
	}

	foreach ($backups as $folder) {
		if (!array_key_exists(basename($folder), $books)) {
			echo "Book with folder " . basename($folder) . " not found!\n";
			continue;
		}

		$id = $books[basename($folder)];

		echo "$id...";
		$files = [];
		exec("find " . escapeshellarg($folder . "/") . " -type f -name '*.mp3'", $files, $ec); if ($ec) exit("Find error!\n");

		$mp3s = [];
		exec("find '/kitobplus/books/storage/" . sprintf("%05d", $id) . "/' -type f -name '*.mp3'", $mp3s, $ec); if ($ec) exit("Find error!\n");

		assert(count($files) && count($files) == count($mp3s));

		sort($files);
		sort($mp3s);

		$ok = true;
		for ($i = 0; $i < count($files); $i++) {
			$out = [];
			$cmp = escapeshellarg($files[$i]) . " " . escapeshellarg($mp3s[$i]);
			exec("cmp $cmp", $out, $ec);
			if ($ec) {
				echo "$cmp compare failed\n";
				$ok = false;
				break;
			}

			if (!($sha256 = hash_file('sha256', $mp3s[$i]))) {
				echo "Error while get hash for " . $mp3s[$i] . "\n";
				$ok =false;
				break;
			}

			sql("update files set sha256 = '$sha256' where books_id = $id and pos = " . ($i + 1));
			if ($db->affected_rows != 1) {
				echo "Error while store sha256 for file " . $mp3s[$i] . "\n";
				$ok = false;
				break;
			}
		}

		exit;
		$out = [];
		exec("rm -rf " . escapeshellarg($folder), $out, $ec);
		if ($ec) {
			echo "error while remove folder $folder\n";
			continue;
		}

		echo "OK\n";
	}
