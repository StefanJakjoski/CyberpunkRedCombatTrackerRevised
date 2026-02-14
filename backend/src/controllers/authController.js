import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

// register new user
export const register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, role } = req.body;   // define req object to vars
        const exists = await User.findOne({ email });   // check if user with email already exists
        if (exists) 
            return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role }); // create new user in database from model
        const token = generateToken(user);  // generate JWT token for the user from utils/jwt.js
        res.status(201).json({ token, user });  // 201: HTTP request has led to the creation of a resource
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;   // define req object to vars
        const user = await User.findOne({ email });  // find user in database by email
        if (!user) 
            return res.status(404).json({ message: "User not found" });

        // compare hashed password from database with unhashed password from req.body
        const match = await user.comparePassword(password); 
        if (!match) 
            return res.status(401).json({ message: "Invalid credentials" });

        // generate JWT token for the user from utils/jwt.js
        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};