import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel} from '../config/db.js';
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

        // Password Hashed??
        const isPasswordValid = password === user.password;

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
        
        // console.log("token =", token);
        
        try {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });
            res.status(200).json({message:"Login successful"});
        } catch (error) {
            console.error('Error setting cookie:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default login;