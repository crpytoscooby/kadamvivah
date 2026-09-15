-- ==============================================================================
-- KadamVivah - Production MySQL / MariaDB Database Schema
-- Hostinger Web Hosting & phpMyAdmin Compatible
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- Core authentication and account state
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `account_status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_account_status` (`account_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: profiles
-- Matrimonial candidate details, moderation status, and contact information
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `middle_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('male', 'female', 'other') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `marital_status` ENUM('never_married', 'divorced', 'widowed', 'separated', 'other') NOT NULL DEFAULT 'never_married',
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
  `pincode` VARCHAR(20) DEFAULT NULL,
  `caste` VARCHAR(100) DEFAULT NULL,
  `sub_caste` VARCHAR(100) DEFAULT NULL,
  `gotra` VARCHAR(100) DEFAULT NULL,
  `education` VARCHAR(150) DEFAULT NULL,
  `occupation` VARCHAR(150) DEFAULT NULL,
  `annual_income` VARCHAR(100) DEFAULT NULL,
  `father_name` VARCHAR(150) DEFAULT NULL,
  `mother_name` VARCHAR(150) DEFAULT NULL,
  `siblings` VARCHAR(255) DEFAULT NULL,
  `family_type` ENUM('nuclear', 'joint', 'other') DEFAULT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `alternate_phone` VARCHAR(30) DEFAULT NULL,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `height` VARCHAR(50) DEFAULT NULL,
  `hobbies` TEXT DEFAULT NULL,
  `status` ENUM('draft', 'pending_approval', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'draft',
  `rejection_reason` TEXT DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_profiles_user_id` (`user_id`),
  KEY `idx_profiles_status` (`status`),
  KEY `idx_profiles_gender` (`gender`),
  KEY `idx_profiles_city` (`city`),
  KEY `idx_profiles_dob` (`date_of_birth`),
  KEY `idx_profiles_caste` (`caste`),
  KEY `idx_profiles_education` (`education`),
  CONSTRAINT `fk_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: profile_photos
-- Uploaded profile photographs (stored locally on Hostinger file storage)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `profile_photos`;
CREATE TABLE `profile_photos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `profile_id` BIGINT UNSIGNED NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_photos_profile_id` (`profile_id`),
  KEY `idx_photos_primary` (`is_primary`),
  CONSTRAINT `fk_photos_profile` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: interests
-- Inter-profile match connection requests & contact disclosure permissions
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `interests`;
CREATE TABLE `interests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_profile_id` BIGINT UNSIGNED NOT NULL,
  `receiver_profile_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
  `message` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_interest_sender_receiver` (`sender_profile_id`, `receiver_profile_id`),
  KEY `idx_interests_sender` (`sender_profile_id`),
  KEY `idx_interests_receiver` (`receiver_profile_id`),
  KEY `idx_interests_status` (`status`),
  CONSTRAINT `fk_interest_sender` FOREIGN KEY (`sender_profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_interest_receiver` FOREIGN KEY (`receiver_profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: auth_rate_limits
-- Tracks authentication attempts per IP for brute-force protection
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `auth_rate_limits`;
CREATE TABLE `auth_rate_limits` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `attempts` INT UNSIGNED NOT NULL DEFAULT 1,
  `last_attempt_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ip_action` (`ip_address`, `action`),
  KEY `idx_rate_limit_lookup` (`ip_address`, `action`, `last_attempt_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
