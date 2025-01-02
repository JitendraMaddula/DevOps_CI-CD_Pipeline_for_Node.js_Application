// Required Modules
const express = require("express");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { body, param, validationResult } = require("express-validator");
const crypto = require("crypto");
const app = express();
const PORT = 3000;
const DATA_FILE = "data.json";

// Ensure data file exists before starting the server
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "JSON File Manipulation API",
      version: "1.0.0",
      description: "API to manipulate a .json file with CRUD operations",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Helper function to read/write JSON file
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading data file:", error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data file:", error);
  }
};

// Validation Middleware
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Generate unique ID for new users
const generateId = () => {
  return parseInt(crypto.randomBytes(4).toString("hex"), 16);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - role
 *         - email
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         role:
 *           type: string
 *           description: Role of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/users", (req, res) => {
  const data = readData();
  res.json(data);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get(
  "/users/:id",
  validate([param("id").isInt().withMessage("ID must be an integer")]),
  (req, res) => {
    const data = readData();
    const user = data.find((u) => u.id === parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Get users by role
 *     parameters:
 *       - in: path
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: Role of the users
 *     responses:
 *       200:
 *         description: List of users with the specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/users/role/:role", (req, res) => {
  const data = readData();
  const users = data.filter((u) => u.role === req.params.role);
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
app.post(
  "/users",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
  ]),
  (req, res) => {
    const data = readData();
    const newUser = { ...req.body, id: generateId() };
    data.push(newUser);
    writeData(data);
    res.status(201).json(newUser);
  }
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
app.put(
  "/users/:id",
  validate([param("id").isInt().withMessage("ID must be an integer")]),
  (req, res) => {
    const data = readData();
    const index = data.findIndex((u) => u.id === parseInt(req.params.id));
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      writeData(data);
      res.json(data[index]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
app.delete(
  "/users/:id",
  validate([param("id").isInt().withMessage("ID must be an integer")]),
  (req, res) => {
    const data = readData();
    const index = data.findIndex((u) => u.id === parseInt(req.params.id));
    if (index !== -1) {
      const deletedUser = data.splice(index, 1);
      writeData(data);
      res.json(deletedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Swagger documentation available at http://0.0.0.0:${PORT}/api-docs`);
});
