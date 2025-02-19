import { ProgressModel } from "../config/db.js"; 

const togglesetDoubleDip = async (req, res)=>
  {

    console.log("entered in lifeline", req.user);
    const userid = req.user.userId;

  
    try {
      console.log(userid);
      const progress = await ProgressModel.findOne({ where: { userid }});
      if (progress.isUsedDoubleDip ==false)
        return res.status(400).json({ error: `Double Dip lifeline already used`});
    progress.isUsedDoubleDip=true;
    await progress.update({ isUsedDoubleDip:progress.isUsedDoubleDip });
    return res.status(200).json({ message: `Lifeline is being used` })
    }
    catch(error){
        console.error("Error using 50-50 lifeline:", error.message);
        throw error;
    }
  }
export  {togglesetDoubleDip};
