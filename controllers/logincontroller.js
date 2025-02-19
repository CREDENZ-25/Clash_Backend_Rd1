import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../config/db.js';
import bcrypt from "bcrypt";

dotenv.config();

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findOne({
            attributes: ['password', 'userid', 'isJunior'],
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password is incorrect!' });
        }

        let token;
        try {
            token = jwt.sign(
                { userId: user.userid, isJunior: user.isJunior },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        } catch (error) {
            console.error('Error generating token:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // ✅ Store token in an HTTP-only cookie (optional)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        // ✅ Return the token in the response
        res.status(200).json({
            message: "Login successful",
            token: token, // ✅ Now the token is returned in the response
            userId: user.userid,
            isJunior: user.isJunior
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default login;
