import express from "express"
import sqlite3 from "sqlite3"
import bcrypt from "bcryptjs"
import session from "express-session"

const PORT = 3000

// Instantiate the app
const app = express()

// Connect to the database
const db = new sqlite3.Database("./database/users.db")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
)

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).send("Username and password are required")
    }

    if (username.length < 3 || /[^a-zA-Z0-9]/.test(username)) {
      return res.status(400).send("Username must be at least 3 characters long and contain only letters and numbers")
    }

    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long")
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // Insert the new user into the database
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`
    await new Promise((resolve, reject) => {
      db.run(sql, [username, hashedPassword], function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            // Manejo del error si el nombre de usuario ya existe
            reject(new Error("Username already exists"))
          } else {
            reject(err)
          }
        }
        resolve()
      })
    })

    res.status(201).send("User registered successfully")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Error registering user: " + err.message)
  }
})

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Verifica que los campos no estén vacíos
    if (!username || !password) {
      return res.status(400).send("Username and password are required")
    }

    const sql = `SELECT * FROM users WHERE username = ?`
    const user = await new Promise((resolve, reject) => {
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(row)
      })
    })

    if (!user) {
      return res.status(401).send("Incorrect username or password")
    }

    // Verifica la contraseña
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      return res.status(401).send("Incorrect username or password")
    }

    // Save user info in session
    req.session.userId = user.id
    res.status(200).send("Logged in successfully")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Error logging in: " + err.message)
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
