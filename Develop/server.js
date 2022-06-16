const inquirer = require("inquirer");
const db = require("./db/index.js");
const connection = 

console.log("PID: ", process.pid);

const startMenu = {
  name: "functionality",
  message: "Hello, welcome to employee manager, what would you like to do?",
  type: "list",
  choices: [
    "View All Departments",
    "View All Roles",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee",
    "Show All Employees",
    "Delete an Employee",
  ],
};

const showAllEmployees = () => {
  db.query(
    `SELECT e1.id as EMP_ID, CONCAT(e1.first_name, ' ', e1.last_name) as Name, title as role, 
  salary, department.name as department FROM employee e1 LEFT JOIN role 
  ON e1.role_id=role.id LEFT JOIN department ON role.department_id=department.id
  LEFT JOIN employee e2 ON e1.manager_id=e2.id`
  ).then((results) => {
    console.log("--------------  EMPLOYEES  --------------");
    console.table(results);
    console.log("--------------  EMPLOYEES  --------------");

    setTimeout(start, 3000);
  });
};

const viewRoles = () => {
  db.query(`SELECT title as Role FROM role`).then((roles) => {
    console.log("--------------  ROLES  --------------");
    console.table(roles);
    console.log("--------------  ROLES  --------------");

    setTimeout(start, 3000);
  });
};

const viewDepartments = () => {
  db.query(`SELECT name FROM department`).then((departments) => {
    console.log("--------------  DEPARTMENTS  --------------");
    console.table(departments);
    console.log("--------------  DEPARTMENTS  --------------");

    setTimeout(start, 3000);
  });
};

const roleAdd = async () => {
  try {
      console.log('Role Add');

      let departments = await db.query("SELECT * FROM department")

      let answer = await inquirer.prompt([
          {
              name: 'title',
              type: 'input',
              message: 'What is the name of your new role?'
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What salary will this role provide?'
          },
          {
              name: 'departmentId',
              type: 'list',
              choices: departments.map((departmentId) => {
                  return {
                      name: departmentId.department_name,
                      value: departmentId.id
                  }
              }),
              message: 'What department ID is this role associated with?',
          }
      ]);
      
      let chosenDepartment;
      for (i = 0; i < departments.length; i++) {
          if(departments[i].name === answer.choice) {
              chosenDepartment = departments[i];
          };
      }
      let result = await db.query("INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
      })

      console.log(`${answer.title} role added successfully.\n`)
      setTimeout(start, 3000);

  } catch (err) {
      console.log(err);
      setTimeout(start, 3000);
  };
}

const departmentAdd = async () => {
  try {
      console.log('Department Add');

      let answer = await inquirer.prompt([
          {
              name: 'deptName',
              type: 'input',
              message: 'What is the name of your new department?'
          }
      ]);

      let result = await db.query("INSERT INTO department SET ?", {
          name: answer.deptName
      });

      console.log(`${answer.deptName} added successfully to departments.\n`)
      setTimeout(start, 3000);

  } catch (err) {
      console.log(err);
      setTimeout(start, 3000);
  };
}

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
};

const updateEmployee = () => {
  db.query(`SELECT id, first_name, last_name FROM employee`)
    .then((results) => {
      console.log("Updating Employee---------");
      console.table(results);
      console.log("Updating Employee---------");
      const employeeChoices = managers.map((man) => {
        return {
          name: `${man.first_name} ${man.last_name}`,
          value: man.id,
        };
      });
      db.query(`UPDATE employee SET ? WHERE ?`, []).then(
        (results) => {
          const choices = results.map((role) => {
            return {
              name: role.title,
              value: role.id,
            };
          });

          const updateEmployeePrompt = [
            {
              name: "choose_employee",
              message: "What is the employee's new first name?",
            },
            {
              name: "last_name",
              message: "What is the employee's new last name?",
            },
            {
              name: "role_id",
              message: "What is the employee's new title?",
              type: "list",
              choices,
            },
            {
              name: "manager_id",
              message: "Who is this employee's new manager?",
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
        }
      );
    })
    .catch(function (err) {
      console.log("Error: ", err);
    });
};

const deleteEmployee = () => {
  db.query(`SELECT id FROM employee`)
    .then((managers) => {
      console.log("Deleting Employee: ");
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

        const deleteEmployeePrompt = [
          {
            name: "id",
            message: "What is the employee's id which needs to be removed?",
            type: "list",
            choices: managerChoices,
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
};

function start() {
  inquirer.prompt(startMenu).then((response) => {
    console.log("Response: ", response);
    switch (response.functionality) {
      case "Show All Employees":
        return showAllEmployees();
      case "Add Employee":
        return addEmployee();
      case "Update Employee":
        return updateEmployee();
      case "Delete an Employee":
        return deleteEmployee();
      case "View All Roles":
        return viewRoles();
      case "Add Role":
        return roleAdd();
      case "View All Departments":
        console.log("--------------  DEPARTMENTS  --------------");
        return viewDepartments();
      case "Add Department":
        return departmentAdd();
    }
  });
}

start();
