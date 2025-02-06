export const signup = async (req,res)=>{
    const {fullName,password,email} = req.body
    try {
        if(!fullName || !email || !password){
            res.status(400).json({msg:"Everything must be necessary"})
        }
        if(password.length <6) {
            return res.status(400).json({msg:"password must be at least 6 characters"})
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({msg:"Email already exist"})
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            })
        }else{
            res.status(400).json({msg:"INVALID USER DATA"})
        }

    } catch (error) {
        console.log("Error in signup controller",error)
        res.status(500).json({msg:"internal server error"})
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:"invalid User"})
        }
        const ispasswordCorrect = await bcrypt.compare(password,user.password)
        if(!ispasswordCorrect){
            return res.status(400).json({msg:"Invalid Credentials"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        })
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({msg:"internal server error"})
    }
}

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({msg: "Logged out successfully"})
    } catch (error) {
        console.log("error in logout controller")
        res.status(500).json({msg:"internal server error"})
    }
}
