const inquirer = require('inquirer');
const db = require('./db');



const startMenu = {
    name: "functionality",
    message: "What would you like to do?",
    type: "list",
    choices: [
        "Add a new employee",
        "View all employees",
        "Update an employee role",
        "Delete an employee",
    ]
}


const showAllEmployees = () => {
    db.query(`SELECT e1.id as EMP_ID, CONCAT(e1.first_name, e1.last_name) as Name, title as role, salary, 
    department.name as department From employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee e2 ON employee e1.manager_id=e2.id`).then(results => {
        console.log('------ EMPLOYEES ------');
        console.table(results);
        console.log('------ END EMPLOYEES ------');
        
        setTimeout(start, 3000);
    })
}

const addEmployee = () => {
    db.query('SELECT id, first_name, last_name FROM employee')
    .then(managers => {
        console.log(managers)
        const managerChoices = managers.map(man => {
            return {
                name: `${man.first_name} ${man.last_name}`,
                value: man.id
            }})
            const addEmployeePrompt = [{
                name: "first_name",
                message: "What is the employee's first name?",
                type: "input"
            },
            {
                name: "last_name",
                message: "What is the employee's last name?",
                type: "input"
            },
            {
                name: "role_id",
                message: "What is the employee's role id?",
                type: "list",
                choices: [{
            
                }]
            },
            {
                name: "manager_id",
                message: "Who is the employee's manager?",
                type: "list",
                choices: [...managerChoices, {name: 'No Manager', value: null}]
            }
            ];
    })
    db.query(`SELECT id, title FROM role`).then(results => {
        console.log(results)
        const choices = results.map(role => {
            return {
                name: role.title,
                value: role.id
    }
}
);
        
    })
    inquirer.prompt(addEmployeePrompt).then((results) => {
        console.log('---Results---', results);
        db.query('INSERT INTO employee SET ?', results).then(() => {setTimeout(startMenu, 3000)
        });
    });
};

const updateEmployeeRole = () => {};

const deleteEmployee = () => {};

function start(){
    inquirer.prompt(startMenu)
    .then((answer) => {
        console.log('Your choice was', answer);

        switch (answer.functionality) {
            case "Show all employees":
                return showAllEmployees();
            case "Add a new employee":
                return addEmployee();
            case "Update an employee role":
                return updateEmployeeRole();
            case "Delete an employee":
                return deleteEmployee();



        }
    })}
    start();