-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- 主機: localhost:3306
-- 產生時間： 2017 年 07 月 19 日 10:45
-- 伺服器版本: 5.6.35
-- PHP 版本： 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- 資料庫： `Aquarium_Device`
--

-- --------------------------------------------------------

--
-- 資料表結構 `Account_Device_Aquarium_Bind`
--

CREATE TABLE `Account_Device_Aquarium_Bind` (
  `ID` int(11) NOT NULL,
  `Info_ID` int(11) NOT NULL,
  `DA_ID` int(11) NOT NULL,
  `Device_Name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `Aquarium_Type` tinyint(1) NOT NULL DEFAULT '0',
  `Is_Bind` tinyint(1) NOT NULL DEFAULT '1',
  `Bind_Time` datetime NOT NULL,
  `Unbind_Time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Device_Aquarium`
--

CREATE TABLE `Device_Aquarium` (
  `DA_ID` int(11) NOT NULL,
  `DP_ID` int(11) NOT NULL,
  `Device_Mac` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Device_Version` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `AP_SSID` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `SSID` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `Connect_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Device_Aquarium_Sensor`
--

CREATE TABLE `Device_Aquarium_Sensor` (
  `ID` bigint(20) NOT NULL,
  `DA_ID` int(11) NOT NULL,
  `Water_Level` decimal(7,4) NOT NULL,
  `Water_Level2` decimal(7,4) NOT NULL,
  `Temperature` decimal(7,4) NOT NULL,
  `PH` decimal(6,4) NOT NULL,
  `Update_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Device_Info`
--

CREATE TABLE `Device_Info` (
  `DA_ID` int(11) NOT NULL,
  `Client_ID` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `TopIC_Sub` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `TopIC_Group` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `Sub_Board_State` tinyint(1) NOT NULL,
  `Set_Water_Level` decimal(7,4) NOT NULL,
  `Set_Water_Level2` decimal(7,4) NOT NULL,
  `Set_Temperature` decimal(7,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Device_Plug_Outlet`
--

CREATE TABLE `Device_Plug_Outlet` (
  `ID` bigint(20) NOT NULL,
  `DA_ID` int(11) NOT NULL,
  `Switch` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `Switch_State` tinyint(1) NOT NULL DEFAULT '0',
  `Update_Time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `Device_Pro`
--

CREATE TABLE `Device_Pro` (
  `DP_ID` int(11) NOT NULL,
  `Device_Model` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `Legal_Mac_Head` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `Manufacturers` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `Init_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Last_Ver` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Update_Time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `Account_Device_Aquarium_Bind`
--
ALTER TABLE `Account_Device_Aquarium_Bind`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Info_ID` (`Info_ID`),
  ADD KEY `DA_ID` (`DA_ID`);

--
-- 資料表索引 `Device_Aquarium`
--
ALTER TABLE `Device_Aquarium`
  ADD PRIMARY KEY (`DA_ID`),
  ADD KEY `DP_ID` (`DP_ID`);

--
-- 資料表索引 `Device_Aquarium_Sensor`
--
ALTER TABLE `Device_Aquarium_Sensor`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `D_ID` (`DA_ID`);

--
-- 資料表索引 `Device_Info`
--
ALTER TABLE `Device_Info`
  ADD UNIQUE KEY `D_ID` (`DA_ID`),
  ADD KEY `Client_ID` (`Client_ID`(255));

--
-- 資料表索引 `Device_Plug_Outlet`
--
ALTER TABLE `Device_Plug_Outlet`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `D_ID` (`DA_ID`);

--
-- 資料表索引 `Device_Pro`
--
ALTER TABLE `Device_Pro`
  ADD PRIMARY KEY (`DP_ID`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `Account_Device_Aquarium_Bind`
--
ALTER TABLE `Account_Device_Aquarium_Bind`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Device_Aquarium`
--
ALTER TABLE `Device_Aquarium`
  MODIFY `DA_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Device_Aquarium_Sensor`
--
ALTER TABLE `Device_Aquarium_Sensor`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Device_Plug_Outlet`
--
ALTER TABLE `Device_Plug_Outlet`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `Device_Pro`
--
ALTER TABLE `Device_Pro`
  MODIFY `DP_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `Account_Device_Aquarium_Bind`
--
ALTER TABLE `Account_Device_Aquarium_Bind`
  ADD CONSTRAINT `account_device_aquarium_bind_ibfk_1` FOREIGN KEY (`DA_ID`) REFERENCES `Device_Aquarium` (`DA_ID`);

--
-- 資料表的 Constraints `Device_Aquarium`
--
ALTER TABLE `Device_Aquarium`
  ADD CONSTRAINT `device_aquarium_ibfk_1` FOREIGN KEY (`DP_ID`) REFERENCES `Device_Pro` (`DP_ID`);

--
-- 資料表的 Constraints `Device_Aquarium_Sensor`
--
ALTER TABLE `Device_Aquarium_Sensor`
  ADD CONSTRAINT `device_aquarium_sensor_ibfk_1` FOREIGN KEY (`DA_ID`) REFERENCES `Device_Aquarium` (`DA_ID`);

--
-- 資料表的 Constraints `Device_Info`
--
ALTER TABLE `Device_Info`
  ADD CONSTRAINT `device_info_ibfk_1` FOREIGN KEY (`DA_ID`) REFERENCES `Device_Aquarium` (`DA_ID`);

--
-- 資料表的 Constraints `Device_Plug_Outlet`
--
ALTER TABLE `Device_Plug_Outlet`
  ADD CONSTRAINT `device_plug_outlet_ibfk_1` FOREIGN KEY (`DA_ID`) REFERENCES `Device_Aquarium` (`DA_ID`);
