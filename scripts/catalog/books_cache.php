<?php
	require_once('connect2db.php');

	$q = sql("show tables like 'books_cache'");
	if (!($row = $q->fetch_assoc())) {
		sql("create table books_cache as select * from books_view");
		sql("alter table books_cache add primary key (id)");
	}

    $q = sql("select * from books_cache_dirty");
	$ids = [];
    while ($row = $q->fetch_assoc()) $ids[] = $row['id'];

    if (!$ids) exit();

	sql("drop table if exists books_cache_old, books_cache_new");

	sql("create table books_cache_new as select * from books_view");
	sql("alter table books_cache_new add primary key (id)");

	sql("RENAME TABLE books_cache TO books_cache_old, books_cache_new TO books_cache");

	sql("DROP TABLE books_cache_old");

	sql("delete from books_cache_dirty where id in (" . implode(",", $ids) . ")");
