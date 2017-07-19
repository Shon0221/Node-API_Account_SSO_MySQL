-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- 主機: localhost:3306
-- 產生時間： 2017 年 07 月 19 日 10:49
-- 伺服器版本: 5.6.35
-- PHP 版本： 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- 資料庫： `Account_Data`
--

-- --------------------------------------------------------

--
-- 資料表結構 `App`
--

CREATE TABLE `App` (
  `App_ID` int(11) NOT NULL,
  `App_Name` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `OS` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `Init_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Last_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Update_Time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Info`
--

CREATE TABLE `Info` (
  `Info_ID` int(11) NOT NULL,
  `Account` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `UserName` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `Sex` tinyint(1) NOT NULL DEFAULT '1',
  `Birthday` date DEFAULT NULL,
  `Country_Code` varchar(4) COLLATE utf8_unicode_ci DEFAULT '',
  `Big_Strickers` varchar(1024) COLLATE utf8_unicode_ci DEFAULT '',
  `Update_Time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Login_Info`
--

CREATE TABLE `Login_Info` (
  `ID` int(11) NOT NULL,
  `Info_ID` int(11) NOT NULL,
  `App_ID` int(11) NOT NULL,
  `Phone_Model` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `OS_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `App_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `Login_Count` int(8) NOT NULL DEFAULT '0',
  `Last_Time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Register_Info`
--

CREATE TABLE `Register_Info` (
  `Info_ID` int(11) NOT NULL,
  `App_ID` int(11) NOT NULL,
  `Reg_Type` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
  `Phone_Model` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `OS_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `App_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `VerifyID` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `VFStates` tinyint(1) NOT NULL DEFAULT '0',
  `DateTime` datetime NOT NULL,
  `VF_DateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `App`
--
ALTER TABLE `App`
  ADD PRIMARY KEY (`App_ID`);

--
-- 資料表索引 `Info`
--
ALTER TABLE `Info`
  ADD PRIMARY KEY (`Info_ID`);

--
-- 資料表索引 `Login_Info`
--
ALTER TABLE `Login_Info`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Info_ID` (`Info_ID`),
  ADD KEY `App_ID` (`App_ID`);

--
-- 資料表索引 `Register_Info`
--
ALTER TABLE `Register_Info`
  ADD UNIQUE KEY `Info_ID` (`Info_ID`),
  ADD KEY `App_ID` (`App_ID`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `App`
--
ALTER TABLE `App`
  MODIFY `App_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Info`
--
ALTER TABLE `Info`
  MODIFY `Info_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Login_Info`
--
ALTER TABLE `Login_Info`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `Login_Info`
--
ALTER TABLE `Login_Info`
  ADD CONSTRAINT `login_info_ibfk_1` FOREIGN KEY (`Info_ID`) REFERENCES `Info` (`Info_ID`),
  ADD CONSTRAINT `login_info_ibfk_2` FOREIGN KEY (`App_ID`) REFERENCES `App` (`App_ID`);

--
-- 資料表的 Constraints `Register_Info`
--
ALTER TABLE `Register_Info`
  ADD CONSTRAINT `register_info_ibfk_1` FOREIGN KEY (`Info_ID`) REFERENCES `Info` (`Info_ID`),
  ADD CONSTRAINT `register_info_ibfk_2` FOREIGN KEY (`App_ID`) REFERENCES `App` (`App_ID`);
