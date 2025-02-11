const login=async (req,res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
        }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password is incorrect!' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,  // Helps to prevent XSS attacks
      secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS in production
      maxAge: 3600000,  // Optional: expires in 1 hour
    });
    
   return res.status(200).json({ message: 'Login successful' });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export {login} ;
