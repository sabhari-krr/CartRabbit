-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2023 at 10:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cartrabbit`
--

-- --------------------------------------------------------

--
-- Table structure for table `owner`
--

CREATE TABLE `owner` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `password` varchar(70) NOT NULL,
  `reset_pwd_token_hash` varchar(70) DEFAULT NULL,
  `reset_pwd_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `owner`
--

INSERT INTO `owner` (`id`, `name`, `email`, `mobile`, `password`, `reset_pwd_token_hash`, `reset_pwd_expiry`) VALUES
(1, 'Test', 'test@gmail.com', 12345, '$2y$10$rQth0RevCQHDT2N4ApGbUOS/n/.eT9gal7bYxEDg2ZxONmkrrrw22', '885c0825fabe0be9cb15db5b167ad5d646360e6f0679f26b91857674538bca42', '2023-12-09 03:01:35'),
(2, 'test2', 'test2@gmail.com', 123, '$2y$10$4q3Gjhv3Zidg4bEGfI4vUuT4nu39inyluSv5jy1yMNwFV9VeUcyEa', NULL, NULL),
(3, 'Sabhari', 'sabhari.a.krr@gmail.com', 8973545148, '$2y$10$MuZB1FHtl8POn.rZVRybdeNOqrpZg./j1swIkPHE1FEFL0yYTMBCK', NULL, NULL),
(4, 'Sabhari2', 'sabhariayyappan1947@gmail.com', 321, '$2y$10$L.JFAd6nudY77YnRpwFVcuCf52TluQb4eo2SHPYqFIeqRNi2fvN4e', NULL, '2023-12-09 20:39:04');

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `house_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `property_name` varchar(50) NOT NULL,
  `roomQty` int(11) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `country` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `postalZip` int(11) NOT NULL,
  `location` varchar(200) NOT NULL,
  `facilities` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`house_id`, `owner_id`, `property_name`, `roomQty`, `address_line`, `country`, `state`, `city`, `postalZip`, `location`, `facilities`) VALUES
(1, 3, 'Chola Inn', 0, 'Periya Nagar, Ramanoor', 'India', 'Tamil Nadu', 'Karur', 999, 'null', 'wifi,food'),
(2, 3, 'Mudhalvan Inn', 0, '728,EB Colony, North Gandhigramam', 'India', 'Tamil Nadu', 'Karur', 639004, 'nnnnn', 'car parking,wifi,medicine,doctor'),
(4, 3, 'Rishikesh Inn', 0, '100, Kodai Road', 'India', 'Tamil Nadu', 'Kodaikanal', 993432, 'kodaikkanal.com', 'wifi,massage,hair spa,roof top swimming pool,car parking,free food'),
(14, 4, 'Chola Inn', 0, '728,EB Colony, North Gandhigramam', 'India', 'Goa', 'Baga', 639004, '123123', '1,2,3,4,5,6,7,8,9');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `room_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `house_id` int(11) NOT NULL,
  `room_name` varchar(50) NOT NULL,
  `floor_size` int(11) NOT NULL,
  `bedQty` int(11) NOT NULL,
  `amenities` text NOT NULL,
  `min_stay` int(11) NOT NULL DEFAULT 1,
  `max_stay` int(11) NOT NULL,
  `rent_per_day` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `reset_pwd_token_hash` (`reset_pwd_token_hash`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`house_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`room_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `owner`
--
ALTER TABLE `owner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `house_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
