const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json({ limit: "100kb" }));

// In-memory storage for learning purposes. Records reset when the server restarts.
let employeeData = [];

function parseEmployeeId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validEmployeeName(value) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 120;
}

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Employee API is running",
    endpoints: [
      "GET /getEmployees",
      "POST /createEmployee",
      "PUT /updateEmployee?empId=1",
      "DELETE /deleteEmployee?empId=1"
    ]
  });
});

app.get("/getEmployees", (_req, res) => {
  res.status(200).json({
    message: "Employee data fetched",
    status: true,
    data: employeeData
  });
});

app.post("/createEmployee", (req, res) => {
  const { empId, empName } = req.body || {};
  const id = parseEmployeeId(empId);

  if (!id || !validEmployeeName(empName)) {
    return res.status(400).json({
      message: "Provide a positive integer empId and a non-empty empName."
    });
  }

  if (employeeData.some(employee => employee.empId === id)) {
    return res.status(409).json({ message: "An employee with this empId already exists." });
  }

  const employee = { empId: id, empName: empName.trim() };
  employeeData.push(employee);

  return res.status(201).json({
    message: "Employee created",
    status: true,
    data: employee
  });
});

app.put("/updateEmployee", (req, res) => {
  const id = parseEmployeeId(req.query.empId);
  if (!id) {
    return res.status(400).json({ message: "Provide a valid positive integer empId query parameter." });
  }

  const employee = employeeData.find(item => item.empId === id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found." });
  }

  const { empName } = req.body || {};
  if (!validEmployeeName(empName)) {
    return res.status(400).json({ message: "Provide a non-empty empName in the request body." });
  }

  employee.empName = empName.trim();
  return res.status(200).json({
    message: "Employee updated",
    status: true,
    data: employee
  });
});

app.delete("/deleteEmployee", (req, res) => {
  const id = parseEmployeeId(req.query.empId);
  if (!id) {
    return res.status(400).json({ message: "Provide a valid positive integer empId query parameter." });
  }

  const index = employeeData.findIndex(employee => employee.empId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Employee not found." });
  }

  const [deletedEmployee] = employeeData.splice(index, 1);
  return res.status(200).json({
    message: "Employee deleted",
    status: true,
    data: deletedEmployee
  });
});

app.listen(port, () => {
  console.log(`Employee API running at http://localhost:${port}`);
});
