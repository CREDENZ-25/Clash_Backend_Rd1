import {User, initUserModel} from '../models/User.js';
import jwt from 'jsonwebtoken';
import {app} from '../index.js';


async function login() {
    app.post('/login', async (req, res) => {
        const {email , password} = req.body;
    try {
      const user=await User.findOne({
            attributes:['password','id','isJunior'],
            where:{
              email:email,
            }
          })
  
      if (!user) {
          return res.status(404).json({ message: 'User not found!' });
          }
        
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              const isPasswordValid = result ;
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Password is incorrect!' });
      }
  
      const token = jwt.sign({ userId: user.id ,category: user.isJunior}, 'your_secret_key', { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true,  // Helps to prevent XSS attacks
        secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS in production
        maxAge: 3600000,  // Optional: expires in 1 hour
      });
  
      return res.status(200).json({ message: 'Login successful' });
              console.log("Password matches!");
            } else {
              console.log("Password does not match.");
            }
          });
          

      
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }})
  } 


  export {login};