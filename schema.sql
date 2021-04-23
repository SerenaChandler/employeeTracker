DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;


CREATE TABLE department (
id INT 
name VARCHAR(30)
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT 
title VARCHAR(30)
salary DECIMAL (10,10)
department_id INT
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT 
first_name VARCHAR(30)
last_name VARCHAR(30)
role_id INT
PRIMARY KEY (id)
);