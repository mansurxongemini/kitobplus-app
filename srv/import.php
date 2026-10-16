<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json; charset=utf-8');
    
    function esc($t) {
        if (strpos($t, "'") === FALSE) return "'$t'";
        if (strpos($t, '"') === FALSE) return '"' . $t . '"';
        return escapeshellarg($t);
    }

    function import() {
        $dirs = [];
        exec("find /kitobplus/books/import/books/ -type d -maxdepth 1 -mindepth 1 2>&1", $dirs, $ec);

        $data = [];
        
        global $db;
        $folders = [];
        $q = $db->query("select folder from books where imported is null");
        while ($row = $q->fetch_assoc()) {
            $folders[] = $row['folder'];
        }

        foreach ($dirs as $dir) {
            if (in_array(basename($dir), $folders)) continue;

            $mp3s = [];
            exec("find " . escapeshellarg($dir) . "/ -type f -iname '*.mp3'", $mp3s, $ec);
            if (!count($mp3s)) continue;

            sort($mp3s);

            $seconds = 0;
            foreach ($mp3s as $mp3) {
                $out = [];
                exec("soxi -D " . esc($mp3), $out);
                $seconds += round(floatval($out[0]), 3);
            }

            $name = basename($dir);
            $title = $name;
            $authors_name = '';
            $dictors_name = '';
            if (preg_match("/^(.+) - (.+)$/u", $title, $m)) {
                $authors_name = trim($m[1]);
                $title = trim($m[2]);

                if (preg_match("/^(.+) \(([^()]+)\)$/u", $title, $mm)) {
                    $title = trim($mm[1]);
                    $dictors_name = trim($mm[2]);
                }
            }

            $data[] = [
                'name' => $name,
                'title' => $title,
                'authors_name' => $authors_name,
                'dictors_name' => $dictors_name,
                'publisher' => '',
                'genres_name' => '',
                'files_count' => count($mp3s),
                'seconds' => round($seconds),
                'folder' => str_replace('/kitobplus/books/import/books/', '', $dir),
                'import' => basename($dir),
                'imported' => null,
                'preview' => 'http://kitobplus.uz/import/books/' . str_replace('/kitobplus/books/import/books/', '', $mp3s[0])
            ];

            //break;
        }

        $found_rows = count($data);

        $sort = in_array($_GET['order'], ['name', 'files_count', 'seconds']) ? $_GET['order'] : 'name';
        if ($_GET['orderDirection'] == 'desc') {
            usort($data, function ($a, $b) use ($sort) {return $a[$sort] == $b[$sort] ? 0 : ($a[$sort] < $b[$sort] ? 1 : -1);});
        } else {
            usort($data, function ($a, $b) use ($sort) {return $a[$sort] == $b[$sort] ? 0 : ($a[$sort] > $b[$sort] ? 1 : -1);});
        }

        foreach ($data as &$_) {
            $_['duration'] = sprintf("%02d:%02d:%02d", floor($_['seconds'] / 3600), floor(floor($_['seconds'] % 3600) / 60), $_['seconds'] % 60);
        }

        if ($_GET['per_page'] * ($_GET['page'] - 1) >= count($data)) {
            $data = [];
        } else {
            $data = array_slice($data, $_GET['per_page'] * ($_GET['page'] - 1));
            if (count($data) > $_GET['per_page']) $data = array_slice($data, 0, $_GET['per_page']);
        }
        
        $filters = [];

        $res = [
            'success' => true,
            'page' => intval($_GET['page']),
            'per_page' => intval($_GET['per_page']),
            'total' => intval($found_rows),
            'total_pages' => ceil($found_rows / intval($_GET['per_page'])),
            'query' => '',
            'filters' => implode("|", $filters),
            'data' => $data
        ];

        return json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }