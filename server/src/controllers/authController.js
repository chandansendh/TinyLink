const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "tinylink_secret_key_123",
    { expiresIn: "30d" }
  );
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user exists
    const userExists = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    // The first user registered can be default admin to make setup painless, or standard 'user'
    // Let's make the first user registered an admin so they can easily test the admin panel! That is an incredibly thoughtful touch for developer convenience!
    const usersCount = await db.query("SELECT COUNT(*) FROM users");
    const role = parseInt(usersCount.rows[0].count) === 0 ? "admin" : "user";

    const newUser = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
      [email.toLowerCase().trim(), hashedPassword, role]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userResult = await db.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching user" });
  }
};
