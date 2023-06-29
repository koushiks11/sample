const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Add bcrypt library
const User = require("./model/user");

const mongoURI =
    "mongodb+srv://kushalkumar:9MThSRtR3oSX2Gk6@cluster0.rwgu7vx.mongodb.net/template?retryWrites=true&w=majority";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

// Connect to MongoDB Atlas
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB Atlas");

        // Start the server
        app.listen(port, () => {
            console.log(`Express listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB Atlas:", error);
    });

// Handle form submission
app.post("/signup", async (req, res) => {
    const {
        fullName,
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
        gender,
    } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(409)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            username,
            email,
            phoneNumber,
            password: hashedPassword, // Store the hashed password in the database
            confirmPassword: hashedPassword,
            gender,
        });

        const savedUser = await newUser.save();

        res.json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res
            .status(500)
            .json({ error: "An error occurred while registering the user" });
    }
});

app.post('/submit', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Passwords match, send the profile.html file with user details
            const filePath = path.join(__dirname, 'static', 'profile.html');
            res.sendFile(filePath, {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender
            });
        } else {
            // Passwords do not match
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (err) {
        console.error('Error finding user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./static/index.html"));
});