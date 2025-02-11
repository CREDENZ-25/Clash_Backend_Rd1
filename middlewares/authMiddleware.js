import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const authMiddleware = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.token;  // Get token from cookies
    console.log("Hello AuthMiddleware")
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }
    try {
        const decoded = jwt.verify(token, "your_secret_key"); 
        console.log(decoded);
        req.user = decoded;  // Attach the decoded user info to the request
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;