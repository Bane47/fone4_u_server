const express = require("express");
const accountsModel = require("../models/users");
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require("jsonwebtoken");
const emailSender = require("../smtp/forgotPassword");
require('dotenv').config();
const nodemailer = require('nodemailer');

const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
const phoneRegEx = /^[6-9]{1}[0-9]{9}$/;

router.get('/getUser', async (req, res) => {
    const { email } = req.query;

    try {
        const loggedUser = await accountsModel.findOne({ email: email });
        if (loggedUser) {
            res.status(200).json(loggedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const secret_key = process.env.JWT_SECRET;
router.post('/login', async (req, res) => {
    const { userEmail, userPassword, rememberMe } = req.body;
    try {
        const user = await accountsModel.findOne({ email: userEmail });

        if (user) {
            if (user.password) {
                const isValid = await bcrypt.compare(userPassword, user.password);
                if (isValid) {
                    let userPayload = { email: user.email, password: user.password };

                    // Check if "Remember me" is checked
                    if (rememberMe) {
                        userPayload.password = user.password;
                    }

                    const accessToken = jwt.sign(userPayload, secret_key, { expiresIn: "2d" });
                    console.log(user)
                    res.json({
                        status: "success",
                        user: {
                            email: user.email,
                            role: user.role
                        },
                        accessToken: accessToken,
                    });
                } else {
                    res.status(401).json({ error: "Password is incorrect" });
                }
            } else {
                res.status(400).json({ error: "No password set for this user" });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Problem with the login", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await accountsModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
            expiresIn: "1d"
        });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'priyadarshanmanoharan@gmail.com',
                pass: "ruos jrry mhar hphm"
            }
        });

        var mailOptions = {
            from: 'priyadarshanmanoharan@gmail.com',
            to: email,
            subject: "Here is your password reset link",
            text: `http://localhost:3000/password-reset/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: "Error sending email" });
            } else {
                return res.status(200).json({ status: "Success" });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Internal Server Error" });
    }
});

// Route for resetting the password
router.post("/password-reset/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: "Error with token" });
            } else {
                const hash = await bcrypt.hash(password, 10);

                const updatedUser = await accountsModel.findByIdAndUpdate(id, { password: hash });

                if (!updatedUser) {
                    return res.status(404).json({ status: "User not found" });
                }

                return res.status(200).json({ status: "Success" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Internal Server Error" });
    }
});

module.exports = router;

router.put('/edit-account/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;

    try {
        const updatedUser = await accountsModel.findByIdAndUpdate(id, updatedUserData, { new: true });
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/change-password/:id', async (req, res) => {
    const { id } = req.params;
    const { oldPassword, email, password } = req.body;

    try {
        const user = await accountsModel.findOne({ email: email });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);

        if (!isValid) {
            res.status(401).json({ error: "Invalid old password" });
            return;
        }

        const updatedUser = await accountsModel.findByIdAndUpdate(id, { password: password }, { new: true });

        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, phone, role, image } = req.body;
    const errors = [];

    if (!name) {
        errors.push("Please enter the name");
    }

    if (!password) {
        errors.push("Please enter the password");
    }

    if (!email) {
        errors.push("Please enter the email id");
    }

    if (!phone) {
        errors.push("Please enter the contact number");
    }
    if (!role) {
        errors.push("Please enter the role")
    }

    if (errors.length > 0) {
        res.status(400).json(errors);
    } else {
        try {
            const hash = await bcrypt.hash(password, 13);
            const userDetails = await accountsModel.create({ name, email, password: hash, phone, role, image });
            res.json(userDetails);
        } catch (err) {
            console.error("Error during registration", err);
            if (err.code === 11000) {
                res.status(500).json({ error: "Duplicate Email" })
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
});

module.exports = router;
