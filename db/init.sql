CREATE DATABASE IF NOT EXISTS business;
USE business;

CREATE TABLE IF NOT EXISTS industries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    warehouse_addition_time INT NOT NULL,
    fee INT NOT NULL,
    linked_industry INT NOT NULL
);
