const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Department",
        "View Roles",
        "View Employee",
        "Update Employee Roles",
        "Exit",
      ],
    })
    .then((answers) => {
      switch (answers.choice) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View Department":
          viewDepartment();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employee":
          viewEmployee();
          break;
        case "Update Employee Roles":
          UpdateEmployeeRoles();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      message: "please enter a department would you like to add?",
      name: "addDepartment",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) values (?)",
        [answer.addDepartment],
        (err, res) => {
          if (err) throw err;
          start();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT name, id FROM department", (err, res) => {
    if (err) throw err;

    const departments = res.map((row) => {
      return { name: row.name, value: row.id };
    });
    inquirer
      .prompt([
        {
          message: "What is the new role called?",
          name: "name",
        },
        {
          type: "list",
          message: "Which department will this role be a part of?",
          name: "department",
          choices: departments,
        },
        {
          type: "number",
          message: "What will the new role's salary be?",
          name: "salary",
        },
      ])
      .then((answer) => {
        console.log(answer);
        connection.query(
          "INSERT INTO role (title, salary, department_id) values (?, ?, ?)",
          [answer.name, answer.salary, answer.department],
          (err, res) => {
            if (err) throw err;
            start();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT title, id FROM role", (err, res) => {
    if (err) throw err;

    const names = res.map((row) => {
      return { name: row.title, value: row.id };
    });

    inquirer
      .prompt([
        {
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          message: "What is the employee's last name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What will their role be",
          name: "role",
          choices: names,
        },
      ])
      .then((answers) => {
        console.log(answers);
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id) values (?, ?, ?)",
          [answers.firstName, answers.lastName, answers.role],
          (err, res) => {
            if (err) throw err;
            start();
          }
        );
      });
  });
}

function viewDepartment() {
  connection.query(`SELECT name AS department FROM department`, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRoles() {
  connection.query(
    `SELECT title, salary, name
    FROM department
    LEFT JOIN role ON department.id = role.department_id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function viewEmployee() {
  connection.query(
    `SELECT e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ",  m.last_name ) AS manager 
    FROM department
    LEFT JOIN role ON department.id = role.department_id
    RIGHT JOIN employee e ON role.id = e.role_id
    LEFT JOIN employee m ON e.id = m.manager_id;
    `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function UpdateEmployeeRoles() {
  connection.query(`SELECT title, id FROM role`, (err, res) => {
    if (err) throw err;
    const roles = res.map((row) => {
      return { name: row.title, value: row.id };
    });

    connection.query(
      `SELECT first_name, last_name, role_id FROM employee`,
      (err, res) => {
        if (err) throw err;
        const names = res.map((row) => {
          return {
            name: row.first_name + " " + row.last_name,
            value: row.role_id,
          };
        });

     

        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee would you like to update?",
              name: "employee",
              choices: names,
            },
            {
              type: "list",
              message: "Which role does this employee need?",
              name: "role",
              choices: roles,
            },
          ])
          .then((answer) => {
            
            connection.query(`UPDATE employee SET role_id = ? WHERE role_id = ?`, [
              answer.role,
              answer.employee,
            ]);
            start();
          });
      }
    );
  });
}
