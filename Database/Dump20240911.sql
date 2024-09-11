-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: clinic_management
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `appointment_creation_date` datetime(6) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_end_time` time(6) NOT NULL,
  `appointment_justification` varchar(500) NOT NULL,
  `appointment_start_time` time(6) NOT NULL,
  `doctor_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `appointment_state` int NOT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `FKoeb98n82eph1dx43v3y2bcmsl` (`doctor_id`),
  KEY `FK4apif2ewfyf14077ichee8g06` (`patient_id`),
  KEY `FKgfk6aobw5507ey7lpyswjxqbn` (`appointment_state`),
  CONSTRAINT `FK4apif2ewfyf14077ichee8g06` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`),
  CONSTRAINT `FKgfk6aobw5507ey7lpyswjxqbn` FOREIGN KEY (`appointment_state`) REFERENCES `appointment_state` (`appointment_state_id`),
  CONSTRAINT `FKoeb98n82eph1dx43v3y2bcmsl` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appointment_state`
--

DROP TABLE IF EXISTS `appointment_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_state` (
  `appointment_state_id` int NOT NULL AUTO_INCREMENT,
  `appointment_state_description` varchar(20) NOT NULL,
  PRIMARY KEY (`appointment_state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctor_id` int NOT NULL AUTO_INCREMENT,
  `doctor_speciality` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `UK3q0j5r6i4e9k3afhypo6uljph` (`user_id`),
  KEY `FKcy856bpdfrntyxkb1gmjgw2i0` (`doctor_speciality`),
  CONSTRAINT `FK9roto9ydtnjfkixvexq5vxyl5` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKcy856bpdfrntyxkb1gmjgw2i0` FOREIGN KEY (`doctor_speciality`) REFERENCES `doctor_speciality` (`speciality_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `doctor_speciality`
--

DROP TABLE IF EXISTS `doctor_speciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_speciality` (
  `speciality_id` int NOT NULL AUTO_INCREMENT,
  `speciality_description` varchar(200) NOT NULL,
  PRIMARY KEY (`speciality_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `patient_registration_date` date NOT NULL,
  `patient_amka` varchar(11) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `UKjid43qw40ffxpqffkwuoist75` (`patient_amka`),
  UNIQUE KEY `UK6i3fp8wcdxk473941mbcvdao4` (`user_id`),
  CONSTRAINT `FKp6ttmfrxo2ejiunew4ov805uc` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient_history`
--

DROP TABLE IF EXISTS `patient_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `history_patient_id` int NOT NULL,
  PRIMARY KEY (`history_id`),
  UNIQUE KEY `UKqx5wf80s98grkwo0l34potpgr` (`history_patient_id`),
  CONSTRAINT `FK2dih9ftvwixo5xup20cl9ubsb` FOREIGN KEY (`history_patient_id`) REFERENCES `patient` (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient_history_registration`
--

DROP TABLE IF EXISTS `patient_history_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_history_registration` (
  `p_history_registration_id` int NOT NULL AUTO_INCREMENT,
  `p_history_registration_date_register` datetime(6) NOT NULL,
  `p_history_registration_health_problems` varchar(255) NOT NULL,
  `p_history_registration_treatment` varchar(255) NOT NULL,
  `p_history_registration_rel_appointment` int NOT NULL,
  `patient_history_id` int NOT NULL,
  PRIMARY KEY (`p_history_registration_id`),
  UNIQUE KEY `UK6qga4ti3n0uewjrih9377x8pt` (`p_history_registration_rel_appointment`),
  KEY `FKbne74sojhu5bownfabjcj17xg` (`patient_history_id`),
  CONSTRAINT `FKbne74sojhu5bownfabjcj17xg` FOREIGN KEY (`patient_history_id`) REFERENCES `patient_history` (`history_id`),
  CONSTRAINT `FKnpk725fra94q0gx91q21jafu3` FOREIGN KEY (`p_history_registration_rel_appointment`) REFERENCES `appointment` (`appointment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_description` varchar(100) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `role_str` varchar(255) DEFAULT NULL,
  `user_id_number` varchar(8) NOT NULL,
  `user_name` varchar(150) NOT NULL,
  `user_password` varchar(60) NOT NULL,
  `user_surname` varchar(150) NOT NULL,
  `user_role` int NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  KEY `FKied680nuc33futf3pbwdsyihr` (`user_role`),
  CONSTRAINT `FKied680nuc33futf3pbwdsyihr` FOREIGN KEY (`user_role`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `working_hours`
--

DROP TABLE IF EXISTS `working_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `working_hours` (
  `working_hours_id` int NOT NULL AUTO_INCREMENT,
  `working_hours_date` date NOT NULL,
  `working_hours_end_time` time(6) NOT NULL,
  `working_hours_start_time` time(6) NOT NULL,
  `working_hours_doctor_id` int NOT NULL,
  PRIMARY KEY (`working_hours_id`),
  KEY `FK284yavkank4ghjjyx8uypkkqi` (`working_hours_doctor_id`),
  CONSTRAINT `FK284yavkank4ghjjyx8uypkkqi` FOREIGN KEY (`working_hours_doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 16:42:12
