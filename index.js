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
        case "Add department":
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

function addRole() {}

function addEmployee() {
  connection.query("SELECT title, id FROM role", (err, res) => {
    if (err) throw err;

    const names = res.map((row) => {
      return { name: row.title, value: row.id };
    });
    console.log(names);
    inquirer
      .prompt([
        {
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          message: "What is the employee's  name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What will their role be",
          name: "role",
          choices: names,
        },
        // {
        //   type: "list",
        //   message: "Who is their manager?",
        //   name: "manager",
        //   choices: [],
        // },
      ])
      .then((answers) => {
        console.log(answers);
      });
  });
}

function viewDepartment() {}

function viewRoles() {}

function viewEmployee() {
  connection.query(
    `SELECT e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ",  m.last_name ) AS manager 
    FROM department
    LEFT JOIN role ON department.id = role.department_id
    LEFT JOIN employee e ON role.id = e.role_id
    LEFT JOIN employee m ON e.id = m.manager_id;
    `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function UpdateEmployeeRoles() {}
