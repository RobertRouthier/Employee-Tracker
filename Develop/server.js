const inquirer = require("inquirer");
const db = require("./db/index.js");

console.log("PID: ", process.pid);

const startMenu = {
  name: "functionality",
  message: "Hello, welcome to employee manager, what would you like to do?",
  type: "list",
  choices: [
    "Add Employee",
    "Update Employee",
    "Show All Employees",
    "Delete an Employee",
  ],
};

const showAllEmployees = () => {
  db.query(
    `SELECT e1.id as EMP_ID, CONCAT(e1.first_name, ' ', e1.last_name) as Name, title as role, 
  salary, department.name as department, IF NULL(CONCAT(e2.first_name, ' ', e2.last_name), 'No Manager') as Manager FROM employee e1 LEFT JOIN role 
  ON e1.role_id=role.id LEFT JOIN department ON role.department_id=department.id
  LEFT JOIN employee e2 ON e1.manager_id=e2.id`
  ).then((results) => {
    console.log("--------------  EMPLOYEES  --------------");
    console.table(results);
    console.log("--------------  EMPLOYEES  --------------");

    setTimeout(start, 3000);
  });
};

const addEmployee = () => {
  db.query(`SELECT id, first_name, last_name FROM employee`)
    .then((managers) => {
      console.log("Managers: ", managers);
      const managerChoices = managers.map((man) => {
        return {
          name: `${man.first_name} ${man.last_name}`,
          value: man.id,
        };
      });
      db.query(`SELECT id, title FROM role`).then((results) => {
        const choices = results.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });

        const addEmployeePrompt = [
          {
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            name: "role_id",
            message: "What is the employee's title?",
            type: "list",
            choices,
          },
          {
            name: "manager_id",
            message: "Who is this employee's manager?",
            type: "list",
            choices: [...managerChoices, { name: "No Manager", value: null }],
          },
        ];

        inquirer.prompt(addEmployeePrompt).then((results) => {
          console.log("RESULTS --- ", results);

          db.query("INSERT INTO employee SET ?", results).then(() =>
            setTimeout(start, 3000)
          );
        });
      });
    })
    .catch(function (err) {
      console.log("Error: ", err);
    });
  // inquirer.prompt();
};

function start() {
  inquirer.prompt(startMenu).then((response) => {
    console.log("Response: ", response);
    switch (response.functionality) {
      case "Show All Employees":
        return showAllEmployees();
      case "Add Employee":
        return addEmployee();
    }
  });
}

start();
