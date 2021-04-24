USE employeeDB;
INSERT INTO department (name)
values ('sales'), ("engineering"), ("Finance"), ("Legal");


INSERT INTO role (title, salary, department_id)
values ("Sales Lead",100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Lead Accountant", 175000, 3), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
values ("joey", "johnson", 2, 2), ("john", "Joseph", 1, NULL), ("sarah", "Karen", 3, NULL), ("Mike", "Chan", 4, 3), 
("Tammer", "Galal", 5, NULL), ("Malia", "Brown", 6, 5), ("Kevin", "Tupik", 7, NULL), ("Tom", "Allen", 8, 7);

