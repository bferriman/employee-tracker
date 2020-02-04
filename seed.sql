USE companyDB;

INSERT INTO department (name)
VALUES ("Accounting"),
("Human Resources"),
("Engineering"),
("Corporate");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 1000000.00, 4),
("Accounting Manager", 120000.00, 1),
("Senior Accountant", 95000.00, 1),
("Junior Accountant", 75000.00, 1),
("HR Manager", 90000.00, 2),
("HR Assistant", 50000.00, 2),
("Engineering Manager", 150000.00, 3),
("Senior Engineer", 125000.00, 3),
("Junior Engineer", 95000.00, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Philip", "Fry", 1, NULL),
("Bilbo", "Baggins", 2, 1),
("Frodo", "Baggins", 3, 2),
("Bender", "Rodriguez", 5, 1),
("Turanga", "Leela", 6, 4),
("Geordi", "La Forge", 7, 1),
("Wesley", "Crusher", 9, 6);