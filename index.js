const express = require("express");
// npm init; npm i express; npm i nodemon;
const app = express();
const port = 4000;

// javascript object notation (JSON)
app.use(express.json());

// rest api
let employeeData = [];

// crud operatins (create, read, update, delete)
app.get("/getEmployees", async (req, res) => {
    res.status(200).json({
        message: "Employee data fetched",
        status: true,
        data: employeeData
    });
});

// create employee data
app.post("/createEmployee", async (req, res) => {
    const data = req.body;

    employeeData.push(data);

    res.json({
        message: "Created Employee data",
        status: true,
        data: data
    });
});

app.put("/updateEmployee", async (req, res) => {
    console.log(req.query);
    const empId = parseInt(req.query.empId);
    console.log(empId);

    employeeData = employeeData.map((value, index) => {
        if (value.empId === empId) {
            return {...value, empName: "Grohith"}
        }

        return value;
    });

    res.json({
        message: "Employee data updated",
        status: true,
        data: employeeData,
    });
});

app.delete("/deleteEmployee", async (req, res) => {
    const empId = parseInt(req.query.empId);

    employeeData = employeeData.filter(each => {
        if (each.empId === empId) {
            return false;
        }

        return true;
    });

    res.json({
        message: "Employee record deleted",
        status: true,
        data: employeeData,
    });
});

app.listen(port, () => {
    console.log(
        `Hey we started the server
         at http://localhost:${port}`);
});