-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2025 at 09:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `option1` varchar(255) NOT NULL,
  `option2` varchar(255) NOT NULL,
  `option3` varchar(255) NOT NULL,
  `option4` varchar(255) NOT NULL,
  `correct_option` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `topic_id`, `question`, `option1`, `option2`, `option3`, `option4`, `correct_option`) VALUES
(18, 6, 'werrf', 'a', 'b', 'adb', 'bgb', 2),
(19, 1, 'Who is the father of C language?\r\n', 'Steve Jobs\r\n', 'James Gosling\r\n', ' Dennis Ritchie', 'Rasmus Lerdorf', 3),
(20, 1, 'Which of the following is not a valid C variable name?', 'int number;', 'float rate;', 'int variable_count;', 'int $main;', 4),
(21, 1, 'All keywords in C are in ____________', 'LowerCase letters', 'UpperCase letters', 'CamelCase letters\r\n', 'None of the mentioned', 1),
(22, 1, 'Which of the following is true for variable names in C?', 'They can contain alphanumeric characters as well as special characters', 'It is not an error to declare a variable to be one of the keywords(like goto, static)', 'Variable names cannot start with a digit', 'Variable can be of any length\r\n', 3),
(23, 1, 'Which is valid C expression?', 'int my_num = 100,000;', 'int my_num = 100000;', 'int my num = 1000;', ' int $my_num = 10000;', 2),
(24, 1, 'Which of the following cannot be a variable name in C?', ' volatile', 'true', 'friend\r\n', 'export', 1),
(25, 2, 'What is the next prime number after 7?', '\'9\'', '\'10\'', '\'11\'', '\'12\'', 3),
(26, 2, 'What is 60 times 8?', '480', '48', '68', '680', 1),
(27, 2, 'Solve: 3 + 6 × (5 + 4) ÷ 3 - 7 ', '10', '12\r\n', '14', '16', 3),
(28, 2, 'What is the area of a square with a side length of 5 cm? ', '10 cm² ', '20 cm²', '25 cm²', '100 cm²', 3),
(29, 2, 'Which of the following is a factor of both 12 and 18?', '3', '4', '5', '6', 4),
(30, 3, 'Who developed Python Programming Language?', 'Wick van Rossum', 'Rasmus Lerdorf', 'Guido van Rossum', 'Niene Stom', 3),
(31, 3, 'Which type of Programming does Python support?', 'object-oriented programming', 'structured programming', 'functional programming', 'all of the mentioned', 4),
(32, 3, 'Is Python case sensitive when dealing with identifiers?', 'no', 'yes', 'machine dependent', 'none of the mentioned', 2),
(33, 3, 'Which of the following is the correct extension of the Python file?', ' .python', '.pl', '.py', '.p', 3),
(34, 3, ' Is Python code compiled or interpreted?', 'Python code is both compiled and interpreted', ' Python code is neither compiled nor interpreted', 'Python code is only compiled', 'Python code is only interpreted', 1),
(35, 4, 'Who invented Java Programming?', 'Guido van Rossum', 'James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup', 2),
(37, 4, 'Which statement is true about Java?', 'Java is a sequence-dependent programming language', 'Java is a code dependent programming language', 'Java is a platform-dependent programming language', 'Java is a platform-independent programming language', 4),
(38, 4, ' Which component is used to compile, debug and execute the java programs?', 'JRE', 'JIT', 'JDK', 'JVM', 3),
(39, 4, 'Which one of the following is not a Java feature?', 'Object-oriented', 'Use of pointers', 'Portable', 'Dynamic and Extensible', 2),
(40, 4, ' Which of these cannot be used for a variable name in Java?\r\n', 'identifier & keyword', 'identifier', 'keyword\r\n', 'none of the mentioned', 3);

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `username`, `topic_id`, `score`, `total_questions`, `rating`, `created_at`) VALUES
(1, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 09:08:25'),
(2, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 09:09:49'),
(3, 'kavyanjalit', 3, 1, 3, NULL, '2025-07-05 09:13:27'),
(4, 'kavyanjalit', 2, 0, 5, NULL, '2025-07-05 09:40:56'),
(5, 'kavyanjalit', 2, 2, 5, NULL, '2025-07-05 09:49:33'),
(6, 'kavyanjalit', 2, 0, 5, NULL, '2025-07-05 12:41:12'),
(7, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 12:42:19'),
(8, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 12:42:38'),
(9, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 12:44:07'),
(10, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 12:45:50'),
(11, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 12:46:39'),
(12, 'kavyanjalit', 2, 2, 5, NULL, '2025-07-05 12:48:07'),
(13, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 12:56:55'),
(14, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 13:12:01'),
(15, 'kavyanjalit', 2, 0, 5, NULL, '2025-07-05 13:21:29'),
(16, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 13:46:08'),
(17, 'kavyanjalit', 3, 1, 5, NULL, '2025-07-05 13:52:26'),
(18, 'kavyanjalit', 1, 5, 6, NULL, '2025-07-05 13:56:24'),
(19, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 13:57:02'),
(20, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 13:58:58'),
(21, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 14:15:41'),
(22, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 14:16:18'),
(23, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 14:20:51'),
(24, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 14:21:49'),
(25, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 14:31:22'),
(26, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 14:38:43'),
(27, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 14:40:37'),
(28, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 14:46:06'),
(29, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 15:16:32'),
(30, 'kavyanjalit', 3, 1, 5, NULL, '2025-07-05 16:08:03'),
(31, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 16:13:31'),
(32, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 16:16:49'),
(33, 'kavyanjalit', 2, 2, 5, NULL, '2025-07-05 16:17:24'),
(34, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-05 16:24:08'),
(35, 'kavyanjalit', 2, 2, 5, NULL, '2025-07-05 16:26:48'),
(36, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 16:27:39'),
(37, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 16:28:21'),
(38, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 16:30:36'),
(39, 'kavyanjalit', 2, 3, 5, NULL, '2025-07-05 16:47:55'),
(40, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-05 16:52:28'),
(41, 'B Yaswanth', 2, 5, 5, NULL, '2025-07-05 16:56:04'),
(42, 'kavyanjali', 2, 5, 5, NULL, '2025-07-06 05:58:44'),
(43, 'kavyanjali', 1, 0, 6, NULL, '2025-07-06 06:03:54'),
(44, 'kavyanjalit', 2, 4, 5, NULL, '2025-07-06 06:08:12'),
(45, 'kavyanjalit', 2, 5, 5, NULL, '2025-07-06 06:09:36'),
(46, 'monika', 2, 4, 5, NULL, '2025-07-06 06:13:33'),
(47, 'monika', 2, 5, 5, NULL, '2025-07-06 06:15:56'),
(48, 'monika', 2, 3, 5, 3, '2025-07-06 06:32:17'),
(49, 'monika', 2, 4, 5, 4, '2025-07-06 06:33:03'),
(50, 'monika', 2, 2, 5, 2, '2025-07-06 06:38:39'),
(51, 'monika', 2, 5, 5, 1, '2025-07-06 06:43:15'),
(52, 'monika', 3, 2, 5, 5, '2025-07-06 06:44:08'),
(53, 'monika', 2, 3, 5, NULL, '2025-07-06 06:48:38'),
(54, 'monika', 2, 4, 5, NULL, '2025-07-06 06:50:03'),
(55, 'monika', 2, 2, 5, NULL, '2025-07-06 06:52:54'),
(56, 'monika', 2, 2, 5, NULL, '2025-07-06 06:54:42'),
(57, 'monika', 2, 3, 5, NULL, '2025-07-06 06:55:25'),
(58, 'kavyanjalit', 2, 2, 5, NULL, '2025-07-06 06:59:42'),
(59, 'monika', 3, 0, 5, NULL, '2025-07-06 07:04:25');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `name`) VALUES
(1, 'c programming'),
(6, 'data structures'),
(5, 'html'),
(4, 'java programming'),
(2, 'Math'),
(3, 'python');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `is_admin`) VALUES
(2, 'yashuu', '$2y$10$tly.n6dniZPE8Y2D4CmAL.tJz.tlAiNxOMUNf7r0bHSYH2tBh/2KK', 0),
(3, 'kavyanjali', '$2y$10$tNdrMXujIffi3jTI3LczJOSH8OaRbC/IaPWJw86yGhMOcKjc7Jb2q', 0),
(4, 'yaswanth', '$2y$10$WC6J.ZpCjcBXLw1747Cub.lh0VoMZbsSx8HEf66HClRqc2o5E4ySi', 0),
(5, 'kavyanjalit', '$2y$10$ZSemwyiY/F9Lo5JelFdwIuPiwOER/uAbfvnKUy2y1pRV4NiSQihAa', 0),
(6, 'harshitha', '$2y$10$lDKxx4/WHAJ8Wqq3fSQ6SOn8.oHWuuKFXs491jWD/45Yv6HP3LP6S', 0),
(8, 'B Yaswanth', '$2y$10$EV//YaoTB6XvP3OPTk14N.1Jn0e6vSTJu4wxBrje2G.2OCDTMST/2', 0),
(9, 'monika', '$2y$10$q0GtXg4mZdZrmMiw8Moth.jTl/2.U90Pdgr.IPoCTxBm4Bb/o5XfS', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
