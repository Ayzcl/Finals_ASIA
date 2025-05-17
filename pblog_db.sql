-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2025 at 06:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pblog_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blog_tbl`
--

CREATE TABLE `blog_tbl` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(100) NOT NULL,
  `author` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_tbl`
--

INSERT INTO `blog_tbl` (`id`, `title`, `content`, `author`) VALUES
(2, 'Moments Between the Lines', 'A reflective journey through the everyday stories, challenges, and quiet triumphs that shape a meani', 'Maya L. Rivers'),
(3, 'Creating a Slow Morning Routine That Actually Work', 'Tired of chaotic mornings? So was I—until I began experimenting with a slower, more intentional star', 'Natalie Brooks'),
(4, 'Digital Detox in the Mountains: A Weekend That Cha', 'Last month, I left my phone behind and headed into the mountains for a 48-hour digital detox. No ema', 'Kai Morgan'),
(5, 'The Hurts You Will Never Know', 'I don\'t often talk about the moments that break me—at least not openly. But the truth is, the most p', 'Azalea Lumbres'),
(8, 'The Lover Boy of Cagayan De Oro', 'The story of Elijah Riley Montefalco and his cousins is totally inspiring.', 'Pierre Angelo Ty'),
(12, 'Winding Roads and Coffee Talks', 'Personal stories and thoughtful insights on navigating the twists of life, one conversation and expe', 'Julian Ortega'),
(13, 'Echoes of Everyday', 'An intimate look at the beauty, struggles, and quiet revelations found in ordinary moments.', 'Elise Hartman'),
(14, 'Blown By The Wind', 'Not a lovestory', 'Percival Archer');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'azi', '$2b$10$aMFb28aLNTF7YuTuCJnQE.t8m9pIP9nuvN2Rd3HtTpGfBFCPv77sy'),
(2, 'azalea', '$2b$10$aqSjvFCKPI.u82BOn3uHXu3ZtBmwe8Lfc8Y3su39IZ.SKMoqQqLxO'),
(6, 'ayzcl', '$2b$10$Q/BpfTI5pCbb0Eu/6Y715eXcw9Y763/uDiKjhjvAaEORvVxrpWhTW'),
(7, ' ', '$2b$10$5A02t4ifMrKCpIexDwxHPeFzZ8irEBbpvAbsIYUsf6NMqyEyTElaK'),
(8, ' ', '$2b$10$ECiUUlyxpIETdBfXhw7cp.atRjLZo1KvUu.66ZoLEPBz2qEdrMkE2'),
(9, ' ', '$2b$10$sXwmiMp1Slsi28rWmFBsde2DJCaUcWZWPsN2qp83g4YZOQpLENDvW'),
(10, 'AYZCL', '$2b$10$Nm.LIGEvv6yc7nw2GwLlkO4EaQUhJHvKHzQE/AhH7ZzCoUqFgQToy'),
(11, 'ejay', '$2b$10$h01KPFxP88BP52LhI9AWJ.pq2A3UuWeTKCtxXzC/VKGTTK4gVmWge'),
(12, 'aziii', '$2b$10$ValMezmzDm5VGORmyqU6SOUtynfqnAXucA/4VP1piA.dBxuQlf5DO'),
(14, ' ', '$2b$10$6OVNwBf6VbhFKzwemR4pzuKcPnwvCiDuU.dEhPMl1KwGM4YkYwbEG'),
(15, '', '$2b$10$esJ7HWgNf87BfCWcisb0M.23XRIskPj9GvQTHpjHcGcNIV5mGcSmK'),
(16, 'azelcastle', '$2b$10$/obI4yrIGQm4Fo.jRaFzlulCCrTiS/V3mfn3rm5bZwFbW5uJzlvzC'),
(18, 'azelcasl', '$2b$10$g5bUGf2ZUQ3DKH0e93461erKUDwMrMhNA96GpgpnZBZbw5G.VZ.DK'),
(19, 'ena', '$2b$10$KYtQi3isL22PKZK7J4YgiudAUnex1MpmgBCyqiyC/zwjBEvuqIwDa'),
(20, 'mika', '$2b$10$UDkxjXQbCMveCfeylsDNoe0w3PWKNrIDI1LV7fY.ZkET3WCkJ0wNy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog_tbl`
--
ALTER TABLE `blog_tbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog_tbl`
--
ALTER TABLE `blog_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
