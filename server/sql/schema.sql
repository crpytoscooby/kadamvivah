-- KadamVivah — MySQL schema (Hostinger Premium / MySQL 5.7+ / MariaDB 10.2+)
--
-- You can import this via hPanel → phpMyAdmin, OR just run install.php once
-- (which creates these tables and the admin user for you).

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- Users (authentication accounts)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`                VARCHAR(191) NOT NULL,
  `password_hash`        VARCHAR(255) NOT NULL,
  `first_name`           VARCHAR(100) NOT NULL DEFAULT '',
  `last_name`            VARCHAR(100) NOT NULL DEFAULT '',
  `role`                 ENUM('user','admin') NOT NULL DEFAULT 'user',
  `must_change_password` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Profiles (matrimonial profiles)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NULL,
  `first_name`    VARCHAR(100) NOT NULL DEFAULT '',
  `middle_name`   VARCHAR(100) NOT NULL DEFAULT '',
  `last_name`     VARCHAR(100) NOT NULL DEFAULT '',
  `email`         VARCHAR(191) NOT NULL DEFAULT '',
  `phone`         VARCHAR(20)  NOT NULL DEFAULT '',
  `dob`           DATE NULL,
  `gender`        ENUM('male','female','other') NULL,
  `city`          VARCHAR(100) NOT NULL DEFAULT '',
  `state`         VARCHAR(100) NOT NULL DEFAULT '',
  `pincode`       VARCHAR(10)  NOT NULL DEFAULT '',
  `caste`         VARCHAR(100) NOT NULL DEFAULT '',
  `sub_caste`     VARCHAR(100) NOT NULL DEFAULT '',
  `education`     VARCHAR(191) NOT NULL DEFAULT '',
  `occupation`    VARCHAR(191) NOT NULL DEFAULT '',
  `annual_income` VARCHAR(100) NOT NULL DEFAULT '',
  `father_name`   VARCHAR(150) NOT NULL DEFAULT '',
  `mother_name`   VARCHAR(150) NOT NULL DEFAULT '',
  `siblings`      VARCHAR(191) NOT NULL DEFAULT '',
  `bio`           TEXT NULL,
  `photos`        TEXT NULL,           -- JSON array of photo URLs
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_profiles_gender` (`gender`),
  KEY `idx_profiles_city` (`city`),
  KEY `idx_profiles_dob` (`dob`),
  KEY `idx_profiles_user` (`user_id`),
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`)
      REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The admin user is created by install.php (so the password is hashed
-- correctly with PHP's password_hash). If you prefer to seed manually,
-- generate a hash with:  php -r "echo password_hash('admin123', PASSWORD_DEFAULT);"
-- and then:
--   INSERT INTO users (email, password_hash, first_name, last_name, role)
--   VALUES ('admin@kadamvivah.in', '<hash>', 'Admin', 'User', 'admin');
