const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

const DB_PATH = './contacts.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Помилка підключення до бази даних:', err.message);
    } else {
        console.log('Підключено до бази даних SQLite.');

        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`, (createTableErr) => {
            if (createTableErr) {
                console.error('Помилка створення таблиці contacts:', createTableErr.message);
            } else {
                console.log('Таблиця "contacts" готова.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            gender TEXT,
            dob TEXT
        )`, (createUsersTableErr) => {
            if (createUsersTableErr) {
                console.error('Помилка створення таблиці users:', createUsersTableErr.message);
            } else {
                console.log('Таблиця "users" готова.');
            }
        });
    }
});


app.use(cors());
app.use(express.json());


app.post('/api/register', (req, res) => {
    const { name, email, password, gender, dob } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password.' });
        }

        db.run("INSERT INTO users (id, name, email, password_hash, gender, dob) VALUES (?, ?, ?, ?, ?, ?)",
            [Date.now().toString(), name, email, hash, gender, dob],
            function (insertErr) {
                if (insertErr) {
                    if (insertErr.message.includes('UNIQUE constraint failed: users.email')) {
                        return res.status(409).json({ message: 'Email already registered.' });
                    }
                    return res.status(500).json({ error: insertErr.message });
                }
                res.status(201).json({ message: 'User registered successfully!', userId: this.lastID, email: email });
            }
        );
    });
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        bcrypt.compare(password, user.password_hash, (compareErr, isMatch) => {
            if (compareErr) {
                return res.status(500).json({ error: 'Error comparing passwords.' });
            }
            if (isMatch) {
                res.status(200).json({
                    message: 'Login successful!',
                    userId: user.id,
                    email: user.email,
                    name: user.name
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        });
    });
});

app.get('/api/profile/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT id, name, email, gender, dob FROM users WHERE id = ?", [id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

app.put('/api/profile/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, gender, dob } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    db.run("UPDATE users SET name = ?, email = ?, gender = ?, dob = ? WHERE id = ?",
        [name, email, gender, dob, id],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed: users.email')) {
                    return res.status(409).json({ message: 'Email already in use by another user.' });
                }
                return res.status(500).json({ error: err.message });
            }
            if (this.changes > 0) {
                res.json({ id: id, name, email, gender, dob });
            } else {
                res.status(404).json({ message: 'User not found or no changes made.' });
            }
        }
    );
});


const isAuthenticated = (req, res, next) => {
    req.user = { id: req.headers['x-user-id'] || req.body.user_id || req.query.user_id };
    if (!req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: User ID required.' });
    }
    next();
};

app.get('/api/contacts', isAuthenticated, (req, res) => {
    const { id: userId } = req.user;
    db.all("SELECT * FROM contacts WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/contacts/:id', isAuthenticated, (req, res) => {
    const { id: contactId } = req.params;
    const { id: userId } = req.user;
    db.get("SELECT * FROM contacts WHERE id = ? AND user_id = ?", [contactId, userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Contact not found or does not belong to user.' });
        }
    });
});


app.post('/api/contacts', isAuthenticated, (req, res) => {
    const { name, phone, email } = req.body;
    const { id: userId } = req.user;
    if (!name || !phone || !email) {
        return res.status(400).json({ message: 'Name, phone, and email are required.' });
    }
    const contactId = Date.now().toString();
    db.run("INSERT INTO contacts (id, name, phone, email, user_id) VALUES (?, ?, ?, ?, ?)",
        [contactId, name, phone, email, userId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: contactId, name, phone, email, user_id: userId });
        }
    );
});

app.put('/api/contacts/:id', isAuthenticated, (req, res) => {
    const { id: contactId } = req.params;
    const { name, phone, email } = req.body;
    const { id: userId } = req.user;
    if (!name || !phone || !email) {
        return res.status(400).json({ message: 'Name, phone, and email are required.' });
    }

    db.run("UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ? AND user_id = ?",
        [name, phone, email, contactId, userId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes > 0) {
                res.json({ id: contactId, name, phone, email, user_id: userId });
            } else {
                res.status(404).json({ message: 'Contact not found or does not belong to user.' });
            }
        }
    );
});

app.delete('/api/contacts/:id', isAuthenticated, (req, res) => {
    const { id: contactId } = req.params;
    const { id: userId } = req.user;
    db.run("DELETE FROM contacts WHERE id = ? AND user_id = ?", [contactId, userId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Contact not found or does not belong to user.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Node.js бекенд працює на http://localhost:${port}`);
    console.log(`База даних SQLite: ${DB_PATH}`);
});