const jwt = require('jsonwebtoken');

require('dotenv').config(); 

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'token is missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
/*async function getUser(){
    try{
        const token = req.cookies.token;
            
        if(!token){
         return res.status(400).json({message:"error"});
        }
    
        const user= jwt.verify(token , 'your_secret_key');
    
        if(!user){
          return res.status(400).json({message:"error"});
        }
    }catch(error){
        console.log("Starting user error", error)
    };
    
}*/

module.exports = authMiddleware;