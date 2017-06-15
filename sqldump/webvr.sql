-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 15. Jun 2017 um 20:01
-- Server Version: 5.6.36
-- PHP-Version: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `webvr`
--
CREATE DATABASE IF NOT EXISTS `webvr` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `webvr`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `apps`
--

CREATE TABLE IF NOT EXISTS `apps` (
`id` int(11) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT '',
  `subtitle` varchar(255) DEFAULT '',
  `fk_backgroundimage` int(11) DEFAULT '0',
  `fk_backgroundaudio` int(11) DEFAULT '0',
  `public` tinyint(1) DEFAULT '0',
  `views` int(11) DEFAULT '0',
  `likes` int(11) DEFAULT '0',
  `share_uid_public` varchar(20) DEFAULT '',
  `share_uid_private` varchar(20) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `published` timestamp NULL DEFAULT NULL,
  `lastupdate` timestamp NULL DEFAULT NULL,
  `lastview` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=4486 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `backgroundaudios`
--

CREATE TABLE IF NOT EXISTS `backgroundaudios` (
`id` int(11) NOT NULL,
  `path` text CHARACTER SET utf8 NOT NULL,
  `volume` float DEFAULT '0.8',
  `lastupdate` timestamp NULL DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `backgroundimages`
--

CREATE TABLE IF NOT EXISTS `backgroundimages` (
`id` int(11) NOT NULL,
  `fk_type` int(11) NOT NULL,
  `path` text NOT NULL,
  `lastupdate` timestamp NULL DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=476 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `backgroundimages_types`
--

CREATE TABLE IF NOT EXISTS `backgroundimages_types` (
`id` int(11) NOT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `objects`
--

CREATE TABLE IF NOT EXISTS `objects` (
`id` int(11) NOT NULL,
  `src` text CHARACTER SET utf8,
  `fk_apps` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `fk_type` int(11) DEFAULT NULL,
  `fk_placement` int(11) DEFAULT '2',
  `rotate` int(11) DEFAULT '270',
  `scale` int(11) DEFAULT '1',
  `raise` int(11) DEFAULT '1',
  `text` text,
  `tts` tinyint(1) DEFAULT '0',
  `volume` float DEFAULT '0.8',
  `youtubestarttime` int(11) DEFAULT NULL,
  `youtubemaxduration` int(11) DEFAULT NULL,
  `lastupdate` timestamp NULL DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=1282 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `objects_placement`
--

CREATE TABLE IF NOT EXISTS `objects_placement` (
`id` int(11) NOT NULL,
  `placement` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `objects_types`
--

CREATE TABLE IF NOT EXISTS `objects_types` (
`id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `scenes`
--

CREATE TABLE IF NOT EXISTS `scenes` (
`id` int(11) NOT NULL,
  `app` varchar(50) NOT NULL,
  `apps_linked` varchar(50) NOT NULL,
  `sequence` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `apps`
--
ALTER TABLE `apps`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `uid` (`uid`), ADD UNIQUE KEY `uid_2` (`uid`), ADD KEY `uid_3` (`uid`), ADD FULLTEXT KEY `title` (`title`,`subtitle`);

--
-- Indizes für die Tabelle `backgroundaudios`
--
ALTER TABLE `backgroundaudios`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `backgroundimages`
--
ALTER TABLE `backgroundimages`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `backgroundimages_types`
--
ALTER TABLE `backgroundimages_types`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `objects`
--
ALTER TABLE `objects`
 ADD PRIMARY KEY (`id`), ADD KEY `id` (`id`,`fk_apps`);

--
-- Indizes für die Tabelle `objects_placement`
--
ALTER TABLE `objects_placement`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `objects_types`
--
ALTER TABLE `objects_types`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `scenes`
--
ALTER TABLE `scenes`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `apps`
--
ALTER TABLE `apps`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4486;
--
-- AUTO_INCREMENT für Tabelle `backgroundaudios`
--
ALTER TABLE `backgroundaudios`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=95;
--
-- AUTO_INCREMENT für Tabelle `backgroundimages`
--
ALTER TABLE `backgroundimages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=476;
--
-- AUTO_INCREMENT für Tabelle `backgroundimages_types`
--
ALTER TABLE `backgroundimages_types`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `objects`
--
ALTER TABLE `objects`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1282;
--
-- AUTO_INCREMENT für Tabelle `objects_placement`
--
ALTER TABLE `objects_placement`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT für Tabelle `objects_types`
--
ALTER TABLE `objects_types`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT für Tabelle `scenes`
--
ALTER TABLE `scenes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=100;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
