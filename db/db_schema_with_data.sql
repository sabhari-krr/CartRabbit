-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2023 at 08:51 AM
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
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `sno` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `adultQty` int(11) NOT NULL,
  `childQty` int(11) NOT NULL,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`sno`, `room_id`, `guest_id`, `adultQty`, `childQty`, `checkin`, `checkout`) VALUES
(29, 45, 10, 2, 0, '2023-12-17', '2023-12-19'),
(30, 45, 10, 2, 0, '2023-12-22', '2023-12-31');

-- --------------------------------------------------------

--
-- Table structure for table `guest`
--

CREATE TABLE `guest` (
  `guest_id` int(11) NOT NULL,
  `guest_name` varchar(200) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `reset_pwd_token` varchar(100) NOT NULL,
  `reset_pwd_expiry` varchar(100) NOT NULL,
  `bookCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guest`
--

INSERT INTO `guest` (`guest_id`, `guest_name`, `email`, `mobile`, `password`, `reset_pwd_token`, `reset_pwd_expiry`, `bookCount`) VALUES
(10, 'Sabhari', 'sabhariayyappan1947@gmail.com', 9008812345, '$2y$10$wWC3R09SZKMRjlOiDr.L5.DF/.P3CL2iAYFpAygqS4FWd5nvettqO', '', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `image_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `house_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `images` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`image_id`, `owner_id`, `house_id`, `room_id`, `images`) VALUES
(93, 21, 19, 44, '1702797198_1.jpg'),
(95, 21, 19, 44, '1702797198_3.jpg'),
(96, 21, 19, 45, '1702797216_8.jpg'),
(97, 21, 19, 45, '1702797216_9.jpg');

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
(21, 'Sabhari', 'sabharisweet@gmail.com', 988744521, '$2y$10$m9i1GpyO9CR/XFP7gySq5ubPsCSDo21DND1jJCcgLDItRQy7vGP8i', NULL, NULL);

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
(38, 21, 'Chola Inn', 1, '728,EB Colony, Gandhigramam', 'India', 'Tamil Nadu', 'Karur', 639004, 'https://maps.app.goo.gl/HEzsEWcKuiCQDHeb7', 'car parking,wifi,medicine,doctor'),
(39, 21, 'Mudhalvan Inn', 1, 'Periya Nagar, Ramanoor', 'India', 'Tamil Nadu', 'Coimbatore', 630011, 'https://maps.app.goo.gl/HEzsEWcKuiCQDHeb7', 'Wifi,CCTV,Food');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `room_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `house_id` int(11) NOT NULL,
  `property_name` varchar(50) NOT NULL,
  `room_name` varchar(50) NOT NULL,
  `floor_size` int(11) NOT NULL,
  `bedQty` int(11) NOT NULL,
  `amenities` text NOT NULL,
  `min_stay` int(11) NOT NULL DEFAULT 1,
  `max_stay` int(11) NOT NULL,
  `rent_per_day` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `owner_id`, `house_id`, `property_name`, `room_name`, `floor_size`, `bedQty`, `amenities`, `min_stay`, `max_stay`, `rent_per_day`) VALUES
(44, 21, 38, 'Chola Inn', 'Chola Master Room', 400, 2, 'ac,sauna', 1, 14, 500),
(45, 21, 39, 'Mudhalvan Inn', 'Master Room Mudhalvan', 600, 4, 'bed,fan,tv,play station 5', 1, 28, 799);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`sno`);

--
-- Indexes for table `guest`
--
ALTER TABLE `guest`
  ADD PRIMARY KEY (`guest_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`image_id`);

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
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `guest`
--
ALTER TABLE `guest`
  MODIFY `guest_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `owner`
--
ALTER TABLE `owner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `house_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
