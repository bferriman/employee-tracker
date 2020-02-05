const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "h#191712sPs)7",
  database: "companydb"
});

connection.connect( err => {
  if (err) throw err;
  showDepartments();
});


function showDepartments() {
  console.log("Showing departments");
  const query = "SELECT name FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(res);
    const choices = res.map(dept => dept.name);
    choices.push("Add a department", "Show all employees", "Exit");
    console.log(choices);
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Departments:",
      choices: choices
    })
    .then( ({ action }) => {
      switch (action) {  
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
          showRoles(action);
          break;
      }
    });
  });
}

function addDepartment() {
  console.log("Adding a department");
  showDepartments();
}

function deleteDepartment(dept) {
  console.log("Deleting department: " + dept);
  showDepartments();
}

function showRoles(department) {
  console.log("Showing roles for " + department);
  const query = "SELECT title, salary FROM role INNER JOIN department on role.department_id = department.id WHERE department.name = ?";
  connection.query(query, [department], (err, res) => {
    if (err) throw err;
    console.log(res);
    const choices = res.map(role => role.title);
    choices.push("Add a role", "Show department employees", "Show department payroll", "Delete department", "Exit");

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: `${department} Roles:`,
      choices: choices
    })
    .then( ({ action }) => {
      switch (action) {  
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
          showEmployeesByRole(action);
          break;
      }
    });
  });
}

function showAllEmployees() {
  console.log("Showing all employees");
  showDepartments();
}

function showEmployeesByRole(role) {
  console.log("Showing " + role + "s");
  showDepartments();
}

function showEmployeesByManager(manager) {
  console.log("Showing " + manager + "'s employees");
  showDepartments();
}
