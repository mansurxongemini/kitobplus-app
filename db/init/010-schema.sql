-- KitobPlus dev database schema (DRAFT, reconstructed from PHP/Python code).
-- MariaDB 10.5 syntax. Load with: mysql < db/init/010-schema.sql
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS kitobplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kitobplus;

-- ---------------------------------------------------------------------------
-- users: app users + admin-managed readers (disability accounts).
-- used in: api/connect2db.php:231-249 (auth/session select), api/connect2db.php:320-333 (getUser),
--   api/connect2db.php:434 (oauth insert), api/auth/verify.php:28-53, api/auth/login.php:9,
--   srv/users.php:33-37, srv/get_user.php:29-32, srv/update_user.php:47-107; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(32) NULL DEFAULT NULL,
  email VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  name VARCHAR(255) NULL DEFAULT NULL,
  first_name VARCHAR(255) NULL DEFAULT NULL,
  patronymic VARCHAR(255) NULL DEFAULT NULL,
  last_name VARCHAR(255) NULL DEFAULT NULL,
  nickname VARCHAR(255) NULL DEFAULT NULL,
  birthday DATE NULL DEFAULT NULL,
  address VARCHAR(512) NULL DEFAULT NULL,
  gender TINYINT NOT NULL DEFAULT 0,
  state TINYINT NOT NULL DEFAULT 0,
  info TEXT NULL DEFAULT NULL,
  allow_retry TINYINT NOT NULL DEFAULT 0,
  levels_id TINYINT NOT NULL DEFAULT 1,
  plans_id INT NOT NULL DEFAULT 1,
  plan_end DATETIME NULL DEFAULT NULL,
  disability TINYINT NULL DEFAULT NULL,
  users_id INT NULL DEFAULT NULL,
  image1_id INT NULL DEFAULT NULL,
  image2_id INT NULL DEFAULT NULL,
  avatar_id INT NULL DEFAULT NULL,
  notification TINYINT NOT NULL DEFAULT 1,
  readers_club TINYINT NULL DEFAULT NULL,
  decode_key TEXT NULL DEFAULT NULL,
  register_date DATETIME NULL DEFAULT NULL,
  deleted DATETIME NULL DEFAULT NULL,
  INDEX idx_users_phone (phone),
  INDEX idx_users_email (email),
  INDEX idx_users_plans (plans_id),
  INDEX idx_users_state (state),
  INDEX idx_users_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- tokens2: mobile/web sessions. token is a 19-digit number from genToken().
-- used in: api/connect2db.php:239-247 (auth join), api/connect2db.php:399-408 (issueToken),
--   api/auth/verify.php:21, api/auth/update_fcm_token.php:7-10; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens2 (
  token BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  users_id INT NOT NULL,
  platform INT NOT NULL DEFAULT 0,
  model VARCHAR(128) NULL DEFAULT NULL,
  dt DATETIME NULL DEFAULT NULL,
  fcm VARCHAR(255) NULL DEFAULT NULL,
  INDEX idx_tokens2_users (users_id),
  INDEX idx_tokens2_fcm (fcm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- signins: OAuth links (google/apple/custom provider) to users.
-- used in: api/connect2db.php:416-443 (signin()); confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS signins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  provider_id VARCHAR(128) NOT NULL,
  email VARCHAR(255) NULL DEFAULT NULL,
  name VARCHAR(255) NULL DEFAULT NULL,
  users_id INT NOT NULL,
  UNIQUE KEY uq_signins_provider (provider, provider_id),
  INDEX idx_signins_users (users_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- sms: phone verification codes. ip stored via INET_ATON().
-- used in: api/auth/sms.php:8-48, api/auth/verify.php:9-13, api/auth/unregister.php:11;
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(32) NOT NULL,
  code VARCHAR(16) NULL DEFAULT NULL,
  sended DATETIME NULL DEFAULT NULL,
  ip INT UNSIGNED NULL DEFAULT NULL,
  INDEX idx_sms_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- authors / dictors (narrators) / genres / publishers: catalog persons.
-- books link via books2authors / books2dictors / books2genres; publishers via books.publishers_id.
-- used in: srv/update_book.php:11-15 (getId insert name), srv/update_person.php:36-40 (name, annotation),
--   api/books/get.php:37-39 (a.*, pics join), srv/index.php:228 (genres id,name,url),
--   srv/options.php:24-32; confidence: high (genres.url medium: single use)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  annotation TEXT NULL DEFAULT NULL,
  INDEX idx_authors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dictors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  annotation TEXT NULL DEFAULT NULL,
  INDEX idx_dictors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  annotation TEXT NULL DEFAULT NULL,
  url VARCHAR(512) NULL DEFAULT NULL,
  INDEX idx_genres_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publishers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  annotation TEXT NULL DEFAULT NULL,
  INDEX idx_publishers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- books: audiobook records. Visibility on public site = row present in
-- books_view/books_cache with deleted NULL and is_readable_from <= NOW().
-- used in: srv/update_book.php:36-70 (folder-only insert; name/annotation/publishers_id/adult update),
--   scripts/import/import.php:27-96, srv/import.php:19, scripts/catalog/cleanup_backups.php:28,
--   srv/books.php:129-148 (books_cache b.* + publishers_id filter),
--   srv/llamaindex/kitob_export.php:6-14; confidence: high
-- (preview_id/url kept from legacy view definition srv/index.php:186; confidence: low)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(512) NULL DEFAULT NULL,
  folder VARCHAR(255) NULL DEFAULT NULL,
  imported DATETIME NULL DEFAULT NULL,
  publishers_id INT NULL DEFAULT NULL,
  annotation TEXT NULL DEFAULT NULL,
  adult TINYINT NULL DEFAULT NULL,
  dictors_id INT NULL DEFAULT NULL,
  is_readable_from DATETIME NULL DEFAULT NULL,
  seconds DECIMAL(12,3) NULL DEFAULT NULL,
  bytes BIGINT NULL DEFAULT NULL,
  preview_id INT NULL DEFAULT NULL,
  url VARCHAR(512) NULL DEFAULT NULL,
  INDEX idx_books_publishers (publishers_id),
  INDEX idx_books_dictors (dictors_id),
  INDEX idx_books_readable (is_readable_from),
  INDEX idx_books_imported (imported),
  INDEX idx_books_folder (folder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- books2authors / books2dictors / books2genres: book<->person M2M with ordering pos.
-- inserts omit pos (scripts/import/import.php:53-58), so pos needs a default.
-- used in: srv/update_book.php:50-53 (delete+insert with pos), scripts/import/import.php:53-58,
--   api/books/get.php:37-39 (join + order by pos), srv/books.php:71-98 (filter subqueries);
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books2authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  authors_id INT NOT NULL,
  pos INT NULL DEFAULT NULL,
  INDEX idx_b2a_book (books_id),
  INDEX idx_b2a_author (authors_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books2dictors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  dictors_id INT NOT NULL,
  pos INT NULL DEFAULT NULL,
  INDEX idx_b2d_book (books_id),
  INDEX idx_b2d_dictor (dictors_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books2genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  genres_id INT NOT NULL,
  pos INT NULL DEFAULT NULL,
  INDEX idx_b2g_book (books_id),
  INDEX idx_b2g_genre (genres_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- pics: cover/person/news images on disk (pics/<target>/<id>.<ext>).
-- PK (target, id): code relies on ON DUPLICATE KEY UPDATE for the same pair.
-- used in: api/news/add.php:42 (news upsert), srv/file_upload.php:81-83 (books/authors/dictors/genres upsert),
--   srv/crop.php:93-98 (select + crop update), api/books/get.php:37-39 (p.ext pics_ext join),
--   srv/persons.php:27 (id in pics filter), srv/books.php:173 (exists pics order);
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pics (
  target VARCHAR(32) NOT NULL,
  id INT NOT NULL,
  ext VARCHAR(8) NULL DEFAULT NULL,
  crop TEXT NULL DEFAULT NULL,
  PRIMARY KEY (target, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- users_files: reader verification docs (image1/image2) under restricted/.
-- files: imported mp3 tracks per book (storage/NNNNN/MMMM.mp3).
-- used in: api/upload_file.php:13 (insert name,ext,size), srv/get_user.php:30 (image1_id/image2_id join),
--   srv/uf.php:17 (select by id), scripts/import/import.php:58 (files insert incl. sha256),
--   scripts/catalog/cleanup_backups.php:69 (sha256 update); confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NULL DEFAULT NULL,
  ext VARCHAR(16) NULL DEFAULT NULL,
  size BIGINT NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  pos INT NULL DEFAULT NULL,
  bytes BIGINT NULL DEFAULT NULL,
  seconds DECIMAL(12,3) NULL DEFAULT NULL,
  sha256 VARCHAR(64) NULL DEFAULT NULL,
  INDEX idx_files_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- imports: books currently being imported (lock table).
-- deleted_books: soft-delete flag source for books_view.deleted.
-- books_cache_dirty: rebuild trigger for books_cache (id autoincrement + dt).
-- used in: scripts/import/import.php:27-99, srv/delete_book.php:26, srv/undelete_book.php:26,
--   srv/publish_book.php:37, scripts/catalog/books_cache.php:10-25; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imports (
  books_id INT NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS deleted_books (
  books_id INT NOT NULL PRIMARY KEY,
  deleted DATETIME NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books_cache_dirty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dt DATETIME NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- books_cache: materialized copy of books_view (CREATE TABLE AS SELECT + PK(id)),
-- rebuilt by scripts/catalog/books_cache.php. Public listing reads from here.
-- used in: scripts/catalog/books_cache.php:6-21 (CTAS + PK), srv/books.php:129-148 (b.* live reads);
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books_cache (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(512) NULL DEFAULT NULL,
  preview_id INT NULL DEFAULT NULL,
  url VARCHAR(512) NULL DEFAULT NULL,
  dictors_id INT NULL DEFAULT NULL,
  is_readable_from DATETIME NULL DEFAULT NULL,
  seconds DECIMAL(12,3) NULL DEFAULT NULL,
  duration TIME NULL DEFAULT NULL,
  added VARCHAR(16) NULL DEFAULT NULL,
  annotation TEXT NULL DEFAULT NULL,
  adult TINYINT NULL DEFAULT NULL,
  publishers_id INT NULL DEFAULT NULL,
  publishers_name VARCHAR(255) NULL DEFAULT NULL,
  dictors_name TEXT NULL DEFAULT NULL,
  authors_name TEXT NULL DEFAULT NULL,
  genres_name TEXT NULL DEFAULT NULL,
  downloads_count INT NOT NULL DEFAULT 0,
  bookshelfs_count INT NOT NULL DEFAULT 0,
  deleted DATETIME NULL DEFAULT NULL,
  folder VARCHAR(255) NULL DEFAULT NULL,
  imported DATETIME NULL DEFAULT NULL,
  bytes BIGINT NULL DEFAULT NULL,
  INDEX idx_books_cache_readable (is_readable_from),
  INDEX idx_books_cache_publishers (publishers_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- bookshelfs: user's book shelf. PK (users_id, books_id) for ON DUPLICATE KEY UPDATE.
-- bookshelfs_history: every add/remove event (is_add 1/0); feeds stats + listened_books_count.
-- used in: api/bookshelf/add.php:7-10, api/bookshelf/remove.php:7-9, api/bookmark/add.php:6,
--   api/books/get.php:22 (dt select), api/connect2db.php:241 (bh join), api/stat/list.php:16-20;
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookshelfs (
  users_id INT NOT NULL,
  books_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (users_id, books_id),
  INDEX idx_bookshelfs_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookshelfs_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  users_id INT NOT NULL,
  books_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  is_add TINYINT NOT NULL DEFAULT 0,
  INDEX idx_bsh_user (users_id),
  INDEX idx_bsh_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- playback_positions: last listened position per user+book. PK (users_id, books_id).
-- bookmarks: saved positions. UNIQUE (users_id, books_id, track, position) for upsert.
-- used in: api/playback_position.php:6-7, api/get_playback_position.php:6,
--   api/bookmarks/add.php:7-13, api/bookmarks/remove.php:7-14, api/books/get.php:16-31;
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS playback_positions (
  users_id INT NOT NULL,
  books_id INT NOT NULL,
  rate FLOAT NULL DEFAULT NULL,
  track INT NULL DEFAULT NULL,
  `position` INT NULL DEFAULT NULL,
  dt DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (users_id, books_id),
  INDEX idx_pp_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookmarks (
  users_id INT NOT NULL,
  books_id INT NOT NULL,
  track INT NOT NULL DEFAULT 0,
  `position` INT NOT NULL DEFAULT 0,
  dt DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (users_id, books_id, track, `position`),
  INDEX idx_bookmarks_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- likes (+history): book likes. favorites (+history): authors/dictors/genres follows.
-- used in: api/like.php:12-13, api/favorite.php:19-23, api/favorites.php:9,
--   api/books/get.php:34, srv/push/sendit.php:50-54 (favorites target authors/dictors/genres);
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  books_id INT NOT NULL,
  users_id INT NOT NULL,
  liked TINYINT NOT NULL DEFAULT 0,
  dt DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (books_id, users_id),
  INDEX idx_likes_user (users_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS likes_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  users_id INT NOT NULL,
  liked TINYINT NOT NULL DEFAULT 0,
  dt DATETIME NULL DEFAULT NULL,
  INDEX idx_likesh_book_user (books_id, users_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
  users_id INT NOT NULL,
  target VARCHAR(16) NOT NULL,
  id INT NOT NULL,
  favorite TINYINT NOT NULL DEFAULT 0,
  dt DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (users_id, target, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  users_id INT NOT NULL,
  target VARCHAR(16) NOT NULL,
  id INT NOT NULL,
  favorite TINYINT NOT NULL DEFAULT 0,
  dt DATETIME NULL DEFAULT NULL,
  INDEX idx_favh_user (users_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- comments: book comments (id 0 = new row via auto_increment).
-- used in: api/comments/add.php:10-30 (explicit id insert + upsert), api/comments/remove.php:10,
--   api/comments/common.php:3 (c.* + users_name join); confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  users_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  books_id INT NOT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  INDEX idx_comments_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- news: announcements (id 0 = new). news_views: view counter (ip via INET_ATON).
-- Public visibility: deleted IS NULL AND dt <= NOW().
-- used in: api/news/add.php:11-33, api/news/remove.php:10 (deleted=now()),
--   api/news/get.php:11-30, api/news/list.php:9-25, api/news/view.php:8-13; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  users_id INT NULL DEFAULT NULL,
  dt DATETIME NULL DEFAULT NULL,
  subject VARCHAR(512) NULL DEFAULT NULL,
  body TEXT NULL DEFAULT NULL,
  deleted DATETIME NULL DEFAULT NULL,
  INDEX idx_news_dt (dt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  ip INT UNSIGNED NULL DEFAULT NULL,
  dt DATETIME NULL DEFAULT NULL,
  users_id INT NULL DEFAULT NULL,
  INDEX idx_newsviews_news (news_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- invoices: Click payment invoices. amount stored as '100.00' string; months = plan length.
-- plans: user access levels (1 trial, 2 full/no-pay, 3 paid). premium_plans.amount = months.
-- used in: api/connect2db.php:73-85 (pushUp sets plans_id=3, plan_end+months),
--   api/access/pay.php:10-56, api/access/invoices.php:8, api/connect2db.php:370 (premium_plans select);
-- confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  users_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  months INT NOT NULL DEFAULT 0,
  payed TINYINT NOT NULL DEFAULT 0,
  cancelled TINYINT NOT NULL DEFAULT 0,
  error TEXT NULL DEFAULT NULL,
  click_id VARCHAR(64) NULL DEFAULT NULL,
  INDEX idx_invoices_user (users_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  UNIQUE KEY uq_plans_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS premium_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NULL DEFAULT NULL,
  amount INT NOT NULL DEFAULT 0,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  enabled TINYINT NOT NULL DEFAULT 1,
  INDEX idx_pplans_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- notifications: push queue per new book (process_start NULL = pending).
-- notifications_detail: per-recipient delivery log (all recipient cols nullable).
-- used in: srv/publish_book.php:31-34, srv/push/send.php:33-38, srv/push/sendit.php:34-83,
--   srv/push/notifications.php:8-15; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  books_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  process_start DATETIME NULL DEFAULT NULL,
  process_end DATETIME NULL DEFAULT NULL,
  INDEX idx_notif_book (books_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications_detail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notifications_id INT NOT NULL,
  dt DATETIME NULL DEFAULT NULL,
  users_id INT NULL DEFAULT NULL,
  fcm VARCHAR(255) NULL DEFAULT NULL,
  email VARCHAR(255) NULL DEFAULT NULL,
  phone VARCHAR(32) NULL DEFAULT NULL,
  name VARCHAR(255) NULL DEFAULT NULL,
  model VARCHAR(128) NULL DEFAULT NULL,
  notification INT NULL DEFAULT NULL,
  success TINYINT NULL DEFAULT NULL,
  INDEX idx_notifd_notif (notifications_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- translation: UI strings (ru source, uz/us targets). UNIQUE (ru) for upsert.
-- used in: api/translation/add.php:10-16, api/translation/export.php:4-10,
--   api/translation/export2csv.php:4; confidence: high
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS translation (
  ru VARCHAR(512) NOT NULL,
  uz TEXT NULL DEFAULT NULL,
  us TEXT NULL DEFAULT NULL,
  UNIQUE KEY uq_translation_ru (ru)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================================================
-- VIEWS (created after all tables; no GROUP BY to stay ONLY_FULL_GROUP_BY-safe)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- books_view: one row per book with denormalized names + counters.
-- Notes: * states columns of the legacy mybook-era definition (commented out in
-- srv/index.php:186, srv/books.php:197) reference the frozen mybook DB and are
-- intentionally NOT part of this view; srv/index.php:158 computes states_id inline.
-- * dictors_name prefers the maintained M2M (books2dictors) with fallback to books.dictors_id.
-- * downloads_count source table is not named anywhere in code (low confidence:
-- derived from playback_positions here).
-- used in: api/books/get.php:11, srv/push/sendit.php:26, srv/push/notifications.php:11,
--   srv/llamaindex/books_export.php:6, srv/update_book.php:40, scripts/import/_import.php:38,
--   scripts/catalog/books_cache.php:6-18 (CTAS source); confidence: medium
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW books_view AS
SELECT
  b.id,
  b.name,
  b.preview_id,
  b.url,
  b.dictors_id,
  b.is_readable_from,
  b.seconds,
  SEC_TO_TIME(b.seconds) AS duration,
  DATE_FORMAT(b.is_readable_from, '%d.%m.%Y') AS added,
  b.annotation,
  b.adult,
  b.publishers_id,
  b.folder,
  b.imported,
  b.bytes,
  (SELECT p.name FROM publishers p WHERE p.id = b.publishers_id) AS publishers_name,
  COALESCE(
    (SELECT GROUP_CONCAT(d.name ORDER BY b2d.pos SEPARATOR ', ')
       FROM books2dictors b2d JOIN dictors d ON d.id = b2d.dictors_id
       WHERE b2d.books_id = b.id),
    (SELECT d2.name FROM dictors d2 WHERE d2.id = b.dictors_id)
  ) AS dictors_name,
  (SELECT GROUP_CONCAT(a.name ORDER BY b2a.pos SEPARATOR ', ')
     FROM books2authors b2a JOIN authors a ON a.id = b2a.authors_id
     WHERE b2a.books_id = b.id) AS authors_name,
  (SELECT GROUP_CONCAT(g.name ORDER BY b2g.pos SEPARATOR ', ')
     FROM books2genres b2g JOIN genres g ON g.id = b2g.genres_id
     WHERE b2g.books_id = b.id) AS genres_name,
  (SELECT COUNT(*) FROM playback_positions pp WHERE pp.books_id = b.id) AS downloads_count,
  (SELECT COUNT(*) FROM bookshelfs bs WHERE bs.books_id = b.id) AS bookshelfs_count,
  (SELECT db.deleted FROM deleted_books db WHERE db.books_id = b.id) AS deleted
FROM books b;

-- ---------------------------------------------------------------------------
-- authors_view / dictors_view / genres_view / publishers_view: base row +
-- books_count + updated (latest linked book date; persons.php filters updated IS NOT NULL).
-- used in: srv/persons.php:45 (authors/dictors/genres), srv/index.php:158-161, api/person/get.php:14;
-- confidence: medium (updated/books_count derivation is a guess: no writes seen in code)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW authors_view AS
SELECT
  a.*,
  (SELECT COUNT(*) FROM books2authors b2a WHERE b2a.authors_id = a.id) AS books_count,
  (SELECT MAX(b.is_readable_from) FROM books2authors b2a JOIN books b ON b.id = b2a.books_id
    WHERE b2a.authors_id = a.id) AS updated
FROM authors a;

CREATE OR REPLACE VIEW dictors_view AS
SELECT
  d.*,
  (SELECT COUNT(*) FROM books2dictors b2d WHERE b2d.dictors_id = d.id) AS books_count,
  (SELECT MAX(b.is_readable_from) FROM books2dictors b2d JOIN books b ON b.id = b2d.books_id
    WHERE b2d.dictors_id = d.id) AS updated
FROM dictors d;

CREATE OR REPLACE VIEW genres_view AS
SELECT
  g.*,
  (SELECT COUNT(*) FROM books2genres b2g WHERE b2g.genres_id = g.id) AS books_count,
  (SELECT MAX(b.is_readable_from) FROM books2genres b2g JOIN books b ON b.id = b2g.books_id
    WHERE b2g.genres_id = g.id) AS updated
FROM genres g;

CREATE OR REPLACE VIEW publishers_view AS
SELECT
  p.*,
  (SELECT COUNT(*) FROM books b WHERE b.publishers_id = p.id) AS books_count,
  (SELECT MAX(b.is_readable_from) FROM books b WHERE b.publishers_id = p.id) AS updated
FROM publishers p;

-- ---------------------------------------------------------------------------
-- users_view: user row + listened books counter (api/readers/list.php needs
-- id, name, nickname, gender, register_date, listened_books_count, avatar_id, readers_club).
-- used in: api/readers/get.php:12, api/readers/list.php:18-23; confidence: high
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW users_view AS
SELECT
  u.*,
  (SELECT COUNT(DISTINCT bh.books_id) FROM bookshelfs_history bh
    WHERE bh.users_id = u.id AND bh.is_add) AS listened_books_count
FROM users u;

-- ---------------------------------------------------------------------------
-- bookshelfs_view / bookshelfs_history_view: shelf rows with human-readable names
-- (srv/bookshelfs.php filters on users_name/books_name, groups by books_id/users_id).
-- used in: srv/bookshelfs.php:38; confidence: high
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW bookshelfs_view AS
SELECT
  bs.users_id,
  bs.books_id,
  bs.dt,
  u.name AS users_name,
  b.name AS books_name
FROM bookshelfs bs
LEFT JOIN users u ON u.id = bs.users_id
LEFT JOIN books b ON b.id = bs.books_id;

CREATE OR REPLACE VIEW bookshelfs_history_view AS
SELECT
  bs.users_id,
  bs.books_id,
  bs.dt,
  bs.is_add,
  u.name AS users_name,
  b.name AS books_name
FROM bookshelfs_history bs
LEFT JOIN users u ON u.id = bs.users_id
LEFT JOIN books b ON b.id = bs.books_id;
