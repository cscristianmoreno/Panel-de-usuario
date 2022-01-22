-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 22-01-2022 a las 15:15:29
-- Versión del servidor: 5.7.31
-- Versión de PHP: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `users`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users`
--

DROP TABLE IF EXISTS `web_users`;
CREATE TABLE IF NOT EXISTS `web_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(56) NOT NULL,
  `surname` varchar(56) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(56) NOT NULL,
  `date_register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unixtime` int(11) NOT NULL,
  `avatar` varchar(56) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `birth_day` int(11) NOT NULL,
  `birth_month` int(11) NOT NULL,
  `birth_year` int(11) NOT NULL,
  `money` int(11) NOT NULL DEFAULT '0',
  `money_total` int(11) NOT NULL DEFAULT '0',
  `delete_date` datetime DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `web_users`
--

INSERT INTO `web_users` (`id`, `name`, `surname`, `password`, `email`, `date_register`, `last_date`, `unixtime`, `avatar`, `gender`, `birth_day`, `birth_month`, `birth_year`, `money`, `money_total`, `delete_date`, `admin`) VALUES
(1, 'Admin', 'Control', '$2a$08$Oe1fpD80sPgeConPAGqqEuFFPgsrHKHuz41k6X0F6Znw7LvC4wBK6', 'admin', '2022-01-17 14:28:34', '2022-01-22 12:14:23', 1642440514, 'avatar/1642696110749.images%20(37).jfif', '-', 0, 0, 0, 0, 0, NULL, 1),
(2, 'Cristian', 'Moreno', '$2a$08$Xrit1yjQrlVrXxT7eXK8gOXcEmAzmyh.1.i51pNFl7Mghge1WMV0K', 'user0@hotmail.com', '2022-01-17 14:30:02', '2022-01-22 11:09:45', 1642440602, 'avatar/1642696110718.images%20(10).jfif', 'Hombre', 24, 10, 1996, 0, 0, NULL, NULL),
(3, 'Torres', 'Francisco', '$2a$08$oJiW2BSKtdRaUBToNWF0ueP.3rOCFjWWcdp24/ZBbLoGMRLNTq39u', 'user1@hotmail.com', '2022-01-18 16:16:43', '2022-01-18 16:16:43', 1642533403, 'avatar/1642696110621.1.jpg', 'Hombre', 27, 7, 1969, 0, 0, NULL, NULL),
(4, 'Carlos', 'Gutierrez', '$2a$08$adKQdsCaRn6dL.sA2QHxsOVXD4FGdxEFPNvRo7LxD75ir6eBTDbCW', 'user2@hotmail.com', '2022-01-18 16:17:54', '2022-01-18 16:17:54', 1642533474, 'avatar/1642696110621.1.jpg', 'Hombre', 30, 10, 1970, 0, 0, NULL, NULL),
(5, 'Cristian', 'Aguilera', '$2a$08$skI75QETR.A58PBPp061w.1DF1ggN.C2vh/uVp6XuU3l7uBFaWKkO', 'user3@hotmail.com', '2022-01-18 16:18:28', '2022-01-18 16:18:28', 1642533508, 'avatar/1642696110621.1.jpg', 'Hombre', 27, 4, 1995, 0, 0, NULL, NULL),
(6, 'Camila', 'Fuentes', '$2a$08$sTJ6motYz2sl4/WMtpsQTuNUx0s6sq5AZTl65s2Zmzv54mpvepst.', 'user4@hotmail.com', '2022-01-18 16:23:10', '2022-01-18 16:23:10', 1642533790, 'avatar/1642696110621.1.jpg', 'Mujer', 29, 11, 1992, 0, 0, NULL, NULL),
(7, 'Ezequiel', 'Lopez', '$2a$08$nMgOQSo1gFqj0irZfMZid.0fxrKV66r4cdQsdFldjjc84EqaXhV6q', 'user5@hotmail.com', '2022-01-18 16:23:53', '2022-01-18 16:23:53', 1642533833, 'avatar/1642696110621.1.jpg', 'Hombre', 28, 1, 1967, 0, 0, NULL, NULL),
(8, 'Roberto', 'Casimiro', '$2a$08$4D7BC/C/YwHEjyqHFFJS6O9AncFccmwkVjmF6AYkbTgpXtkhntXca', 'user6@hotmail.com', '2022-01-18 16:25:13', '2022-01-18 16:25:13', 1642533913, 'avatar/1642696110621.1.jpg', 'Hombre', 18, 6, 1968, 0, 0, NULL, NULL),
(9, 'Aldana', 'Plaza', '$2a$08$5aPQcRT.KgBVhOGG5WfjPe13FiNmgLZ6xgFCQbdL8YroKpu2zQh7q', 'user7@hotmail.com', '2022-01-18 17:33:34', '2022-01-18 17:33:34', 1642538014, 'avatar/1642696110621.1.jpg', 'Mujer', 15, 11, 1968, 0, 0, NULL, NULL),
(10, 'Antonio', 'Nieves', '$2a$08$GpyNf9qe9Kah.ftyKt17XeN76qhQMwp6GsLB2vcnnLdtjV0Dh/KXO', 'user8@hotmail.com', '2022-01-18 17:39:10', '2022-01-18 17:39:10', 1642538350, 'avatar/1642696110621.1.jpg', 'Hombre', 28, 2, 1967, 0, 0, NULL, NULL),
(11, 'Paula', 'Diaz', '$2a$08$p9qiRe.xIcQ91Zz8RKzfI.MaA95Lfst.xQfnoPKP8NFzimv/0uSZO', 'user9@hotmail.com', '2022-01-18 17:41:23', '2022-01-18 17:41:23', 1642538483, 'avatar/1642696110621.1.jpg', 'Hombre', 20, 8, 1971, 0, 0, NULL, NULL),
(12, 'Roberto', 'Plaza', '$2a$08$Ro/VQ5SyuFvGCDjJfFn6FuY0rGU3jMhRPFyM.5pnw887IhRO4RRae', 'user10@hotmail.com', '2022-01-20 13:26:41', '2022-01-20 13:26:41', 1642696001, 'avatar/1642696110621.1.jpg', 'Hombre', 1, 1, 1950, 0, 0, NULL, NULL),
(13, 'Francisco', 'Perez', '$2a$08$jr/Sb71/QGpQiu9WTyTjUunypYJx0PBgCx6BJbMGSGNmD7pWtQiba', 'user11@hotmail.com', '2022-01-21 12:07:11', '2022-01-21 12:07:11', 1642777631, 'avatar/1642696110621.1.jpg', 'Hombre', 19, 10, 1970, 0, 0, NULL, NULL),
(14, 'Romina', 'Rodriguez', '$2a$08$b.dNByyABodKHF41eT2AK.pgU6uH9y1.aT1xq3MHnNzL8M3KlHdsK', 'user12@hotmail.com', '2022-01-21 12:07:56', '2022-01-21 12:07:56', 1642777676, 'avatar/1642696110621.1.jpg', 'Mujer', 19, 8, 1994, 0, 0, NULL, NULL),
(15, 'Rocio', 'Montero', '$2a$08$f4LOXWKWyLH.1aXN2PtTrOZ2xGyX4LQlU9ORsnXoLt5dhWHL2IREy', 'user13@hotmail.com', '2022-01-22 11:08:09', '2022-01-22 11:08:09', 1642860489, 'avatar/1642696110621.1.jpg', 'Hombre', 20, 12, 1969, 0, 0, NULL, NULL),
(16, 'Graciela', 'Soto', '$2a$08$f07BArylUg9ts9rwoLjCAughLVetEseXcCgpBsPn/7Y/KDjBKA9Su', 'usuario14@hotmail.com', '2022-01-22 11:08:50', '2022-01-22 11:08:50', 1642860530, 'avatar/1642696110621.1.jpg', 'Hombre', 21, 11, 1968, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users_messages`
--

DROP TABLE IF EXISTS `web_users_messages`;
CREATE TABLE IF NOT EXISTS `web_users_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id_send` int(11) NOT NULL,
  `user_id_received` varchar(128) NOT NULL,
  `message_title` varchar(128) NOT NULL,
  `message_description` longtext NOT NULL,
  `message_viewed` tinyint(1) NOT NULL DEFAULT '0',
  `message_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `message_unixtime` int(11) NOT NULL,
  `message_send_delete_date` datetime DEFAULT NULL,
  `message_received_delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `web_users_messages`
--

INSERT INTO `web_users_messages` (`id`, `user_id_send`, `user_id_received`, `message_title`, `message_description`, `message_viewed`, `message_date`, `message_unixtime`, `message_send_delete_date`, `message_received_delete_date`) VALUES
(1, 2, '1', 'Un mensaje para el administrador!', 'Test msn n° 1', 1, '2022-01-17 14:31:17', 1642440677, NULL, '2022-01-17 16:44:10'),
(2, 2, '1', 'Test Mensaje N° 2', 'Test msj n° 2', 1, '2022-01-17 17:53:18', 1642452798, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users_money_send`
--

DROP TABLE IF EXISTS `web_users_money_send`;
CREATE TABLE IF NOT EXISTS `web_users_money_send` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id_send` bigint(20) NOT NULL,
  `user_name_send` varchar(56) NOT NULL,
  `user_surname_send` varchar(56) NOT NULL,
  `user_email_send` varchar(56) NOT NULL,
  `user_id_received` int(11) NOT NULL,
  `user_name_received` varchar(56) NOT NULL,
  `user_surname_received` varchar(56) NOT NULL,
  `user_email_received` varchar(56) NOT NULL,
  `amount` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_unixtime` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `confirm_unixtime` int(11) NOT NULL,
  `type` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users_notifications`
--

DROP TABLE IF EXISTS `web_users_notifications`;
CREATE TABLE IF NOT EXISTS `web_users_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(128) NOT NULL,
  `notification_title` varchar(100) NOT NULL,
  `notification_description` varchar(100) NOT NULL,
  `notification_viewed` tinyint(1) NOT NULL DEFAULT '0',
  `notification_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notification_unixtime` int(11) NOT NULL,
  `notification_type` varchar(27) DEFAULT NULL,
  `notification_delete_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `web_users_notifications`
--

INSERT INTO `web_users_notifications` (`id`, `user_id`, `user_name`, `notification_title`, `notification_description`, `notification_viewed`, `notification_date`, `notification_unixtime`, `notification_type`, `notification_delete_date`) VALUES
(1, 2, 'Cristian Moreno undefined', 'NUEVO MENSAJE', 'Le enviaste un mensaje a Admin Control', 1, '2022-01-17 14:31:17', 1642440677, 'MESSAGE', '2022-01-17 20:05:51'),
(2, 1, 'Admin Control undefined', 'NUEVO MENSAJE', 'Cristian Moreno te envió un mensaje', 1, '2022-01-17 14:31:17', 1642440677, 'MESSAGE', NULL),
(3, 2, 'Cristian Moreno undefined', 'NUEVO MENSAJE', 'Le enviaste un mensaje a Admin Control', 1, '2022-01-17 17:53:18', 1642452798, 'MESSAGE', NULL),
(4, 1, 'Admin Control undefined', 'NUEVO MENSAJE', 'Cristian Moreno te envió un mensaje', 1, '2022-01-17 17:53:18', 1642452798, 'MESSAGE', NULL),
(5, 1, 'Admin Control undefined', 'CONTRASEÑA MODIFICADA', 'Actualización de contraseña', 1, '2022-01-19 16:54:41', 1642622081, 'UPDATE_PASSWORD', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users_report`
--

DROP TABLE IF EXISTS `web_users_report`;
CREATE TABLE IF NOT EXISTS `web_users_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(56) NOT NULL,
  `user_surname` varchar(56) NOT NULL,
  `user_email` varchar(56) NOT NULL,
  `report_type` varchar(32) NOT NULL,
  `report_title` varchar(56) NOT NULL,
  `report_description` text NOT NULL,
  `report_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `report_unixtime` int(11) NOT NULL,
  `report_status` varchar(20) NOT NULL DEFAULT ' Sin respuesta',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `web_users_vinculated`
--

DROP TABLE IF EXISTS `web_users_vinculated`;
CREATE TABLE IF NOT EXISTS `web_users_vinculated` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vinculated_id` int(11) NOT NULL,
  `vinculated_name` varchar(56) DEFAULT NULL,
  `vinculated_surname` varchar(56) NOT NULL,
  `vinculated_already_email` varchar(128) NOT NULL,
  `vinculated_email` varchar(128) NOT NULL,
  `vinculated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `vinculated_systime` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
