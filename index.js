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
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const choices = res.map(dept => dept.name);
    console.log(choices);
    choices.push("Add a department", "Delete a department", "Show all employees", "Exit");
    console.log(choices);

    // inquirer
    // .prompt({
    //   name: "action",
    //   type: "list",
    //   message: "Departments:",
    //   choices: [
    //     "Find songs by artist",
    //     "Find all artists who appear more than once",
    //     "Find data within a specific range",
    //     "Search for a specific song",
    //     "exit"
    //   ]
    // })
    // .then(function(answer) {
    //   switch (answer.action) {  
    //   case "Find songs by artist":
    //     artistSearch();
    //     break;
  
    //   case "Find all artists who appear more than once":
    //     multiSearch();
    //     break;
  
    //   case "Find data within a specific range":
    //     rangeSearch();
    //     break;
  
    //   case "Search for a specific song":
    //     songSearch();
    //     break;
  
    //   case "exit":
    //     connection.end();
    //     break;
    //   }
    // });  
  });
}

function showRoles(department) {
  console.log("Showing roles for " + department);
}

function showEmployeesByRole(role) {
  console.log("Showing " + role + "s");
}

function showEmployeesByManager(manager) {
  console.log("Showing " + manager + "'s employees");
}
