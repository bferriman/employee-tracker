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

let currentDept = null;
let currentRole = null;
let currentEmp = null;

function showDepartments() {
  console.log("*******************");
  const query = "SELECT id, name FROM department";
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
          selectDepartment(res);
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

function selectDepartment(rawDepartments) {
  const departments = rawDepartments.map( dept => {
    return {
      value: {
        id: dept.id,
        name: dept.name
      },
      name: dept.name
    };
  });
  inquirer
  .prompt({
    name: "dept",
    type: "list",
    message: "Select:",
    choices: departments
  })
  .then( ({ dept }) => {
    currentDept = dept;
    showRoles(dept);
  });
}

function showRoles(dept) {
  console.log("*******************");
  const query = "SELECT role.id, title, salary FROM role INNER JOIN department on role.department_id = department.id WHERE department.id = ?";
  connection.query(query, [dept.id], (err, res) => {
    if (err) throw err;
    const choices = [];
    if(!res.length) {
      console.log("There are no roles for this department.");
      choices.splice(0, 0, "Add a role", "Delete department", "Exit");
    }
    else {
      console.table(`${dept.name} Roles`, res);
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
          selectRole(res);
          break;

        case "Add a role":
          addRole(dept);
          break;
    
        case "Show department employees":
          showDeptEmployees(dept);
          break;
      
        case "Show department payroll":
          showPayroll(dept);
          break;

        case "Delete department":
          deleteDepartment(dept);
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

function selectRole(rawRoles) {
  const roles = rawRoles.map( role => {
    return {
      value: {
        id: role.id,
        title: role.title
      },
      name: role.title
    };
  });

  inquirer
  .prompt({
    name: "role",
    type: "list",
    message: "Select:",
    choices: roles
  })
  .then( ({ role }) => {
    currentRole = role;
    showEmployeesByRole(role);
  });
}

function showEmployeesByRole(role) {
  console.log("*******************");
  const query = `SELECT
  employee.id,
  CONCAT(employee.first_name, " ", employee.last_name) AS employee_name,
  CONCAT(e2.first_name, " ", e2.last_name) AS manager_name,
  employee.manager_id
  FROM employee
  LEFT JOIN role r1 ON employee.role_id = r1.id
  LEFT JOIN employee e2 ON (employee.manager_id=e2.id)
  WHERE r1.title = ?;`

  connection.query(query, [role.title], (err, res) => {
    if (err) throw err;
    const choices = [];
    if(!res.length) {
      console.log("There are no employees with that role.");
      choices.splice(0, 0, "Add an employee", "Delete role", "Exit");
    }
    else {
      console.table(`${role.title} Employees`, res);
      choices.splice(0, 0, "View an employee", "Add an employee", "Delete role", "Exit");
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
        case "View an employee":
          selectEmployee(res);
          break;

        case "Add an employee":
          addEmployee(role);
          break;
    
        case "Delete role":
          deleteRole(role);
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

function selectEmployee(employees) {
  const emps = employees.map( emp => {
    return {
      value: {
        id: emp.id,
        employee_name: emp.employee_name
      },
      name: emp.employee_name
    };
  });

  inquirer
  .prompt({
    name: "employee",
    type: "list",
    message: "Select:",
    choices: emps
  })
  .then( ({ employee }) => {
    curentEmp = employee;
    showEmployee(employee);
  });
}

function showEmployee(employee) {
  console.log("*******************");
  const query = `SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  employee.role_id,
  r1.title,
  employee.manager_id,
  CONCAT(e2.first_name, " ", e2.last_name) AS manager_name
  FROM employee
  LEFT JOIN role r1 ON employee.role_id = r1.id
  LEFT JOIN employee e2 ON (employee.manager_id=e2.id)
  WHERE employee.id = ?;`

  connection.query(query, [employee.id], (err, res) => {
    if (err) throw err;
    if(!res.length) {
      console.log("Employee not found.");
      showDepartments();
    }
    else {
      console.table(`Employee Record`, res);
      console.log("-------------------");
      const choices = ["Edit first name", "Edit last name", "Assign new role", "Assign new manager", "Delete employee", "Exit"];

      inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Select:",
        choices: choices
      })
      .then( ({ action }) => {
        switch (action) {  
          case "Edit first name":
            editFirstName(employee);
            break;
  
          case "Edit last name":
            editLastName(employee);
            break;
      
          case "Assign new role":
            assignRole(employee);
            break;

          case "Assign new manager":
            assignManager(employee);
            break;

          case "Delete employee":
            deleteEmployee(employee);
            break;
  
          case "Exit":
            connection.end();
            break;
  
          default:
            console.log("Unexpected selection");
        }
      });
    }
  });
}

function addDepartment() {
  inquirer
  .prompt({
    name: "deptName",
    message: "Department Name:",
    validate: function(input) {
      if(input === "") {
        return "Department name is a required field";
      }
      else {
        return true;
      }
    }
  })
  .then( ({ deptName }) => {
    const query = `INSERT INTO department (name) VALUES ("${deptName}")`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      showDepartments();
    });
  });
}

function addRole(dept) {

  inquirer
  .prompt([
  {
    name: "roleTitle",
    message: "Role Title:",
    validate: function(input) {
      if(input === "") {
        return "Role title is a required field";
      }
      else {
        return true;
      }
    }  
  },
  {
    name: "salary",
    message: "Role Salary:",
    validate: function(input) {
      const num = parseInt(input);
      if(num < 0 || isNaN(num)) {
        return "Salary must be a positive number";
      }
      else {
        return true;
      }
    }
  }
  ])
  .then( result => {
    const query = `INSERT INTO role (title, salary, department_id) VALUES ("${result.roleTitle}", ${result.salary}, ${dept.id})`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      showRoles(dept);
    });
  });
}

function addEmployee(role) {
  inquirer
  .prompt([
  {
    name: "firstName",
    message: "First Name:",
    validate: function(input) {
      if(input === "") {
        return "First name is a required field";
      }
      else {
        return true;
      }
    }  
  },
  {
    name: "lastName",
    message: "Last Name:",
    validate: function(input) {
      if(input === "") {
        return "Last name is a required field";
      }
      else {
        return true;
      }
    }
  }
  ])
  .then( result => {
    const query = `INSERT INTO employee (first_name, last_name, role_id)
    VALUES ("${result.firstName}", "${result.lastName}", ${role.id})`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      showEmployeesByRole(role);
    });
  });
}

function deleteDepartment(dept) {
  const query = "DELETE FROM department WHERE id = ?";
  connection.query(query, [dept.id], (err, res) => {
    if (err) throw err;
    showDepartments();
  });
}

function deleteRole(role) {
  const query = "DELETE FROM role WHERE id = ?";
  connection.query(query, [role.id], (err, res) => {
    if (err) throw err;
    showRoles(currentDept);
  });
}

function deleteEmployee(employee) {
  const query = "DELETE FROM employee WHERE id = ?";
  connection.query(query, [employee.id], (err, res) => {
    if (err) throw err;
    showEmployeesByRole(currentRole);
  });
}

function editFirstName(employee) {
  inquirer
  .prompt({
    name: "firstName",
    message: "New First Name:",
    validate: function(input) {
      if(input === "") {
        return "First name is a required field";
      }
      else {
        return true;
      }
    }  
  })
  .then( ({ firstName }) => {
    const query = "UPDATE employee SET first_name = ? WHERE id = ?";
    connection.query(query, [firstName, employee.id], (err, res) => {
      if (err) throw err;
      showEmployee(employee);
    });
  });
}

function editLastName(employee) {
  inquirer
  .prompt({
    name: "lastName",
    message: "New Last Name:",
    validate: function(input) {
      if(input === "") {
        return "Last name is a required field";
      }
      else {
        return true;
      }
    }  
  })
  .then( ({ lastName }) => {
    const query = "UPDATE employee SET last_name = ? WHERE id = ?";
    connection.query(query, [lastName, employee.id], (err, res) => {
      if (err) throw err;
      showEmployee(employee);
    });
  });
}

function assignRole(employee) {
  const query = "SELECT role.id, title, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const roles = res.map( role => {
      return {
        value: {
          id: role.id,
          title: role.title,
          department: role.department
        },
        name: `${role.id} | ${role.title} | ${role.department}`
      };
    });
    inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Select New Role:",
      choices: roles
    })
    .then( ({ role }) => {
      const query = "UPDATE employee SET role_id = ? WHERE id = ?";
      connection.query(query, [role.id, employee.id], (err, res) => {
        if (err) throw err;
        showEmployee(employee);
      });
    });
  });
}

function assignManager(employee) {
  const query = `SELECT
	employee.id,
  CONCAT(employee.first_name, " ", employee.last_name) AS employee_name,
  r1.title as role,
  d1.name as department
  FROM employee
  LEFT JOIN role r1 ON employee.role_id = r1.id
  LEFT JOIN department d1 ON (r1.department_id=d1.id)`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const employees = res.map( emp => {
      return {
        value: {
          id: emp.id,
          name: emp.employee_name,
          role: emp.role,
          department: emp.department
        },
        name: `${emp.id} | ${emp.employee_name} | ${emp.role} | ${emp.department}`
      };
    });
    inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Select New Manager:",
      choices: employees
    })
    .then( ({ manager }) => {
      const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
      connection.query(query, [manager.id, employee.id], (err, res) => {
        if (err) throw err;
        showEmployee(employee);
      });
    });
  });
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
