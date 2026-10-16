-- KitobPlus FAKE dev seed. No real personal data.
-- Load after 010-schema.sql: mysql < db/init/020-dev-seed.sql
-- Visibility logic (from code): a book shows up in
--   * api/books/get.php via books_view (no state filter, just needs the row);
--   * srv/books.php via books_cache with date(is_readable_from) <= date(now());
--   * srv/index.php?states=2 via books_view with deleted IS NULL + is_readable_from <= NOW().
-- Hence: is_readable_from in the past, no deleted_books rows, books_cache filled
-- from books_view. Login flow (api/auth/sms.php + verify.php) needs no pre-existing
-- rows (user auto-created; phones ending in 2004333 get the code in the response),
-- but a state=2 test user is seeded for convenience.
USE kitobplus;

-- 3 genres / 3 authors / 2 narrators / 1 publisher
INSERT INTO genres (id, name, annotation, url) VALUES
  (1, 'Roman', 'Roman janridagi audiokitoblar', 'roman'),
  (2, 'Hikoya', 'Hikoyalar to''plami', 'hikoya'),
  (3, 'Ertak', 'Bolalar uchun ertaklar', 'ertak');

INSERT INTO authors (id, name, annotation) VALUES
  (1, 'Abdulla Qodiriy', 'O''zbek romanchiligining asoschisi'),
  (2, 'O''tkir Hoshimov', 'O''zbek yozuvchisi'),
  (3, 'Tohir Malik', 'O''zbek adibi');

INSERT INTO dictors (id, name, annotation) VALUES
  (1, 'Jasur Karimov', 'Audiokitob ovozlashtiruvchisi'),
  (2, 'Dilnoza Rahimova', 'Audiokitob ovozlashtiruvchisi');

INSERT INTO publishers (id, name, annotation) VALUES
  (1, 'KitobPlus nashriyoti', 'Dev nashriyot');

-- 5 visible books (is_readable_from in the past, imported set)
INSERT INTO books (id, name, folder, imported, publishers_id, annotation, adult, is_readable_from, seconds, bytes) VALUES
  (1, 'O''tkan kunlar', 'otkan-kunlar', NOW(), 1, 'Abdulla Qodiriyning mashhur romani', NULL, '2024-03-10 09:00:00', 37200.000, 895000000),
  (2, 'Mehrobdan chayon', 'mehrobdan-chayon', NOW(), 1, 'Tarixiy roman', NULL, '2024-06-01 10:00:00', 28800.000, 691000000),
  (3, 'Dunyoning ishlari', 'dunyoning-ishlari', NOW(), 1, 'Qissa va hikoyalar', NULL, '2024-09-15 12:00:00', 19800.000, 475000000),
  (4, 'Shaytanat (1-kitob)', 'shaytanat-1', NOW(), 1, 'Mashhur romanlar silsilasi', 18, '2025-01-20 08:00:00', 45000.000, 1080000000),
  (5, 'Zumrad va Qimmat', 'zumrad-va-qimmat', NOW(), 1, 'Bolalar ertagi', NULL, '2025-05-01 09:30:00', 3600.000, 86000000);

INSERT INTO books2authors (books_id, authors_id, pos) VALUES
  (1, 1, 1), (2, 1, 1), (3, 2, 1), (4, 3, 1), (5, 2, 1);

INSERT INTO books2dictors (books_id, dictors_id, pos) VALUES
  (1, 1, 1), (2, 2, 1), (3, 1, 1), (4, 1, 1), (5, 2, 1);

INSERT INTO books2genres (books_id, genres_id, pos) VALUES
  (1, 1, 1), (2, 1, 1), (3, 2, 1), (4, 1, 1), (5, 3, 1);

-- one mp3 track row per book (sha256 values are fake placeholders)
INSERT INTO files (books_id, pos, bytes, seconds, sha256) VALUES
  (1, 1, 895000000, 37200.000, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
  (2, 1, 691000000, 28800.000, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
  (3, 1, 475000000, 19800.000, 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'),
  (4, 1, 1080000000, 45000.000, 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'),
  (5, 1, 86000000, 3600.000, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

-- covers: needed for `only_with_pics` filter and for persons listing (pics filter)
INSERT INTO pics (target, id, ext) VALUES
  ('books', 1, 'jpg'), ('books', 2, 'jpg'), ('books', 3, 'jpg'),
  ('books', 4, 'jpg'), ('books', 5, 'jpg'),
  ('authors', 1, 'jpg'), ('authors', 2, 'jpg'), ('authors', 3, 'jpg'),
  ('dictors', 1, 'jpg'), ('dictors', 2, 'jpg'),
  ('genres', 1, 'jpg'), ('genres', 2, 'jpg'), ('genres', 3, 'jpg'),
  ('publishers', 1, 'jpg');

-- materialize the public listing cache exactly as the cron would
INSERT INTO books_cache
  (id, name, preview_id, url, dictors_id, is_readable_from, seconds, duration,
   added, annotation, adult, publishers_id, publishers_name, dictors_name,
   authors_name, genres_name, downloads_count, bookshelfs_count, deleted,
   folder, imported, bytes)
SELECT
  id, name, preview_id, url, dictors_id, is_readable_from, seconds, duration,
  added, annotation, adult, publishers_id, publishers_name, dictors_name,
  authors_name, genres_name, downloads_count, bookshelfs_count, deleted,
  folder, imported, bytes
FROM books_view;

-- access levels: 1 trial / 2 full / 3 paid (pushUp() assigns 3); premium amount = months
INSERT INTO plans (id, name) VALUES
  (1, 'Sinov'),
  (2, 'Cheksiz'),
  (3, 'Premium');

INSERT INTO premium_plans (id, name, amount, price, enabled) VALUES
  (1, '1 oylik', 1, 15000.00, 1),
  (2, '3 oylik', 3, 39000.00, 1);

-- 2 public news (dt in the past, deleted NULL)
INSERT INTO news (id, users_id, dt, subject, body, deleted) VALUES
  (1, NULL, '2025-08-01 10:00:00', 'Yangi audiokitoblar qo''shildi',
   'Kutubxonamizga beshta yangi audiokitob qo''shildi. Maroqli tinglash!', NULL),
  (2, NULL, '2025-09-10 12:00:00', 'Ilova yangilandi',
   'KitobPlus ilovasining yangi versiyasi chiqdi.', NULL);

-- test user for phone login (sms code flow needs no pre-seeded sms row)
INSERT INTO users (id, phone, name, state, levels_id, plans_id, plan_end, notification, register_date, deleted) VALUES
  (1, '998902004333', 'Test User', 2, 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), 1, NOW(), NULL);

-- UI strings sample
INSERT INTO translation (ru, uz, us) VALUES
  ('Слушать', 'Tinglash', 'Listen'),
  ('Книги', 'Kitoblar', 'Books');
