const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "h#191712sPs)7",
  database: "companydb"
});

connection.connect( err => {
  if (err) throw err;  
  console.log("*******************");
  console.log("Welcome to Employee Tracker!");
  showDepartments();
});


function showDepartments() {
  console.log("*******************");
  const query = "SELECT name FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const choices = [];
    if(!res.length) {
      console.log("There are no departments.");
      choices.splice(0, 0, "Add a department", "Exit");
    }
    else {
      console.table("Departments", res);
      choices.splice(0, 0, "View a department", "Add a department", "Show all employees", "Exit");
    }
    console.log("-------------------");

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Select:",
      choices: choices
    })
    .then( ({ action }) => {
      switch (action) {
        case "View a department":
          selectDepartment(res.map(dept => dept.name));
          break;

        case "Add a department":
          addDepartment();
          break;
    
        case "Show all employees":
          showAllEmployees();
          break;
      
        case "Exit":
          connection.end();
          break;

        default:
          console.log("Unexpected selection");
      }
    });
  });
}

function selectDepartment(departments) {
  inquirer
  .prompt({
    name: "dept",
    type: "list",
    message: "Select:",
    choices: departments
  })
  .then( ({ dept }) => {
    showRoles(dept);
  });
}

function showRoles(department) {
  console.log("*******************");
  const query = "SELECT title, salary FROM role INNER JOIN department on role.department_id = department.id WHERE department.name = ?";
  connection.query(query, [department], (err, res) => {
    if (err) throw err;
    const choices = [];
    if(!res.length) {
      console.log("There are no roles for this department.");
      choices.splice(0, 0, "Add a role", "Delete department", "Exit");
    }
    else {
      console.table(`${department} Roles`, res);
      choices.splice(0, 0, "View a role", "Add a role", "Show department employees", "Show department payroll", "Delete department", "Exit");
    }
    console.log("-------------------");

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Select:",
      choices: choices
    })
    .then( ({ action }) => {
      switch (action) {  
        case "View a role":
          selectRole(res.map(role => role.title));
          break;

        case "Add a role":
          addRole();
          break;
    
        case "Show department employees":
          showDeptEmployees(department);
          break;
      
        case "Show department payroll":
          showPayroll(department);
          break;

        case "Delete department":
          deleteDepartment(department);

        case "Exit":
          connection.end();
          break;

        default:
          console.log("Unexpected selection");
      }
    });
  });
}

function selectRole(roles) {
  inquirer
  .prompt({
    name: "role",
    type: "list",
    message: "Select:",
    choices: roles
  })
  .then( ({ role }) => {
    showEmployeesByRole(role);
  });

}

function showEmployeesByRole(role) {
  console.log("*******************");
  // const query = "SELECT first_name, last_name FROM employee INNER JOIN role on employee.role_id = role.id WHERE role.title = ?";
  // const query = "SELECT * FROM employee INNER JOIN role on employee.role_id = role.id WHERE role.title = ?";
  const query = `SELECT employee.first_name, employee.last_name,
  CONCAT(e2.first_name, " ", e2.last_name) AS manager_name
  FROM employee
  LEFT JOIN role r1 ON employee.role_id = r1.id
  LEFT JOIN employee e2 ON (employee.manager_id=e2.id)
  WHERE r1.title = ?;`

  connection.query(query, [role], (err, res) => {
    if (err) throw err;
    if(!res.length) {
      console.log("There are no employees with that role.");
    }
    else {
      console.table(`${role} Employees`, res);
    }
    console.log("-------------------");
  });
  connection.end();
  //   const choices = res.map(role => role.title);
  //   choices.push("Add a role", "Show department employees", "Show department payroll", "Delete department", "Exit");

  //   inquirer
  //   .prompt({
  //     name: "action",
  //     type: "list",
  //     message: "Select:",
  //     choices: choices
  //   })
  //   .then( ({ action }) => {
  //     switch (action) {  
  //       case "Add a role":
  //         addRole();
  //         break;
    
  //       case "Show department employees":
  //         showDeptEmployees(department);
  //         break;
      
  //       case "Show department payroll":
  //         showPayroll(department);
  //         break;

  //       case "Delete department":
  //         deleteDepartment(department);

  //       case "Exit":
  //         connection.end();
  //         break;

  //       default:
  //         showEmployeesByRole(action);
  //         break;
  //     }
  //   });
  // });
}


function addDepartment() {
  console.log("Adding a department");
  showDepartments();
}

function addRole() {
  console.log("Adding a role");
  showDepartments();
}

function deleteDepartment(dept) {
  console.log("Deleting department: " + dept);
  showDepartments();
}

function showAllEmployees() {
  console.log("Showing all employees");
  showDepartments();
}

function showDeptEmployees(dept) {
  console.log(`Showing employees for ${dept}`);
  showDepartments();
}

function showEmployeesByManager(manager) {
  console.log("Showing " + manager + "'s employees");
  showDepartments();
}

function showPayroll(dept) {
  console.log(`Showing payroll for ${dept}`);
  showDepartments();
}
